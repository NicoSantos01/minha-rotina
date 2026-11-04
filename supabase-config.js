 // ==========================================
 // CONEXÃO COMPARTILHADA COM O SUPABASE
 // ==========================================
 const SUPABASE_URL =
   "https://wlyijvjorhmcmjgdpzka.supabase.co";

 const SUPABASE_PUBLISHABLE_KEY =
   "sb_publishable_HEfjDacHGG2I3To_sPmPog_4KBtRkjr";

 window.supabaseClient = window.supabase.createClient(
   SUPABASE_URL,
   SUPABASE_PUBLISHABLE_KEY
 );

 console.log(
   "Supabase conectado:",
   !!window.supabaseClient
 );
