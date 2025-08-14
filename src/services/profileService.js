import { supabase } from '../lib/supabase';

export const profileService = {
  // Create or update user profile
  async upsertProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          health_goals: profileData.healthGoals,
          subscribe_newsletter: profileData.subscribeNewsletter,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error upserting profile:', error);
      return { data: null, error };
    }
  },

  // Get user profile
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }
  },

  // Save BMI calculation
  async saveBMICalculation(userId, bmiData) {
    try {
      const { data, error } = await supabase
        .from('bmi_calculations')
        .insert({
          user_id: userId,
          weight: bmiData.weight,
          height: bmiData.height,
          age: bmiData.age,
          gender: bmiData.gender,
          activity_level: bmiData.activityLevel,
          bmi_value: bmiData.bmi,
          bmi_category: bmiData.category,
          health_goals: bmiData.healthGoals,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error saving BMI calculation:', error);
      return { data: null, error };
    }
  },

  // Get BMI history
  async getBMIHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('bmi_calculations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching BMI history:', error);
      return { data: null, error };
    }
  },

  // Save diet plan
  async saveDietPlan(userId, dietPlanData) {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .insert({
          user_id: userId,
          diet_type: dietPlanData.dietType,
          weekly_plan: dietPlanData.weeklyPlan,
          calories_per_day: dietPlanData.caloriesPerDay,
          health_goals: dietPlanData.healthGoals,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error saving diet plan:', error);
      return { data: null, error };
    }
  },

  // Get diet plan history
  async getDietPlanHistory(userId, limit = 5) {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching diet plan history:', error);
      return { data: null, error };
    }
  }
};
