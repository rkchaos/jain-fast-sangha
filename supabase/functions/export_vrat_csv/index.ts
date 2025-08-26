import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set auth header for supabase client
    supabase.auth.setAuth(authHeader.replace('Bearer ', ''));

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const timeframe = url.searchParams.get('timeframe') || '365d';
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    // Calculate date range
    let dateFilter = '';
    if (startDate && endDate) {
      dateFilter = `date.gte.${startDate},date.lte.${endDate}`;
    } else {
      const days = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      dateFilter = `date.gte.${fromDate.toISOString().split('T')[0]}`;
    }

    // Fetch user's vrat records with sangha information
    const { data: vratRecords, error: vratError } = await supabase
      .from('vrat_records')
      .select(`
        *,
        sanghas (
          name
        )
      `)
      .eq('user_id', user.id)
      .filter('date', 'gte', dateFilter.split('.')[1])
      .order('date', { ascending: false });

    if (vratError) {
      console.error('Error fetching vrat records:', vratError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch vrat records' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile for export metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, phone')
      .eq('id', user.id)
      .single();

    // Convert to CSV
    const csvHeaders = [
      'Date',
      'Vrat Type',
      'Status',
      'Sangha',
      'Note',
      'Is Retrospective',
      'Created At'
    ];

    const csvRows = vratRecords?.map(record => [
      record.date,
      record.vrat_type,
      record.status,
      record.sanghas?.name || 'Personal',
      `"${(record.note || '').replace(/"/g, '""')}"`, // Escape quotes in notes
      record.is_retrospective ? 'Yes' : 'No',
      new Date(record.created_at).toLocaleDateString()
    ]) || [];

    // Generate CSV content
    const csvContent = [
      `# Vrat Records Export - ${profile?.name || 'User'}`,
      `# Phone: ${profile?.phone || 'N/A'}`,
      `# Export Date: ${new Date().toLocaleDateString()}`,
      `# Timeframe: ${timeframe}`,
      `# Total Records: ${csvRows.length}`,
      '',
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Generate filename
    const filename = `jain-sangha-vrat-records-${user.id.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.csv`;

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });

  } catch (error) {
    console.error('Error in export_vrat_csv function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});