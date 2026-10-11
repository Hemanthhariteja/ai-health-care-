const mongoose = require('mongoose');

// Flexible schema to accommodate all the CSV columns
const healthcareDataSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: true,
    index: true
  },
  age: {
    type: Number,
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  blood_type: {
    type: String,
    index: true
  },
  medical_condition: {
    type: String,
    index: true
  },

  // Hospital Information
  date_of_admission: Date,
  doctor: String,
  hospital: String,
  insurance_provider: String,
  billing_amount: Number,
  room_number: String,
  admission_type: String,
  discharge_date: Date,

  // Medications and Test Results
  medication: String,
  test_results: String,

  // Vital Signs and Health Metrics
  glucose: Number,
  blood_pressure: String,
  bmi: Number,
  oxygen_saturation: Number,
  lengthofstay: Number,
  cholesterol: Number,
  triglycerides: Number,
  hba1c: Number,

  // Lifestyle Factors
  smoking: Number,
  alcohol: Number,
  physical_activity: Number,
  diet_score: Number,
  family_history: Number,
  stress_level: Number,
  sleep_hours: Number,

  // Birth and demographic data
  subject_birthyear: Number,
  subject_ageatfirstdraw: Number,
  sample_drawyear: Number,
  sample_subjectageatdraw: Number,
  sample_dayssincefirstvisit: Number,

  // Anthropometric measurements
  am_bmi: Number,
  am_height: Number,
  am_weight: Number,

  // Chemistry panel
  chem_alt: Number,
  chem_albumin: Number,
  chem_alkaline_phosphatase: Number,
  chem_ast: Number,
  chem_t_bili: Number,
  chem_bun: Number,
  chem_calcium: Number,
  chem_co2: Number,
  chem_cl: Number,
  chem_creatinine: Number,
  chem_egfr_aa: Number,
  chem_egfr_non_aa: Number,
  chem_globin: Number,
  chem_glucose: Number,
  chem_potassium: Number,
  chem_protein: Number,
  chem_sodium: Number,

  // Blood count
  bc_perc_basophils: Number,
  bc_perc_eosinophils: Number,
  bc_perc_lymphocytes: Number,
  bc_perc_monocytes: Number,
  bc_perc_neutrophils: Number,
  bc_basophil_count: Number,
  bc_eosinophil_count: Number,
  bc_lymphocyte_count: Number,
  bc_monocyte_count: Number,
  bc_neutrophil_count: Number,
  bc_hematocrit: Number,
  bc_hemoglobin: Number,
  bc_mch: Number,
  bc_mchc: Number,
  bc_mcv: Number,
  bc_mpv: Number,
  bc_platelet_count: Number,
  bc_red_blood_cell_count: Number,
  bc_rdw: Number,
  bc_wbc: Number,

  // Immunology
  cmv_igg_serology: Number,

  // Inflammation markers
  infl_anti_ccp3: Number,
  infl_anti_ccp31: Number,
  infl_hs_crp: Number,
  infl_rf_iga_result: Number,
  infl_rf_igm_result: Number,
  infl_esr: Number,

  // Lipid panel
  lip_cholesterol_hdl: Number,
  lip_cholesterol_ldl: Number,
  lip_cholesterol_non_hdl: Number,
  lip_cholesterol_total: Number,
  lip_cholesterol_hdl_ratio: Number,
  lip_triglycerides: Number,

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for common queries
healthcareDataSchema.index({ medical_condition: 1, age: 1 });
healthcareDataSchema.index({ hospital: 1 });
healthcareDataSchema.index({ insurance_provider: 1 });

module.exports = mongoose.model('HealthcareData', healthcareDataSchema);
