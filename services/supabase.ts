
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://atzluthrvichnysqechc.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emx1dGhydmljaG55c3FlY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTUzNTQsImV4cCI6MjA3ODQ3MTM1NH0.rRkK7aajwch6eMwsEu-NlYZxvwb5yMO3Hx3MaMmJXAU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
