const HealthcareData = require('../models/HealthcareData');
const fs = require('fs');
const csv = require('csv-parse');

class HealthcareDataService {
  /**
   * Import healthcare data from CSV file
   */
  static async importFromCSV(filePath) {
    return new Promise((resolve, reject) => {
      const records = [];

      fs.createReadStream(filePath)
        .pipe(csv.parse({ columns: true, skip_empty_lines: true }))
        .on('data', (data) => {
          // Transform CSV data to match schema
          const transformedData = this.transformCSVRecord(data);
          records.push(transformedData);
        })
        .on('end', async () => {
          try {
            // Check if data already exists
            const existingCount = await HealthcareData.countDocuments();
            if (existingCount > 0) {
              return resolve({
                success: true,
                message: 'Healthcare data already exists in database',
                count: existingCount
              });
            }

            // Insert all records
            const result = await HealthcareData.insertMany(records, { ordered: false });
            resolve({
              success: true,
              message: 'Data imported successfully',
              count: result.length
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Transform CSV record to match schema
   */
  static transformCSVRecord(data) {
    const transformed = {
      name: data.name,
      age: parseInt(data.age) || 0,
      gender: data.gender?.toLowerCase(),
      blood_type: data['blood type'],
      medical_condition: data['medical condition'],
      date_of_admission: data['date of admission'] ? new Date(data['date of admission']) : null,
      doctor: data.doctor,
      hospital: data.hospital,
      insurance_provider: data['insurance provider'],
      billing_amount: parseFloat(data['billing amount']) || 0,
      room_number: data['room number'],
      admission_type: data['admission type'],
      discharge_date: data['discharge date'] ? new Date(data['discharge date']) : null,
      medication: data.medication,
      test_results: data['test results'],
      
      // Health metrics
      glucose: parseFloat(data.glucose),
      blood_pressure: data['blood pressure'],
      bmi: parseFloat(data.bmi),
      oxygen_saturation: parseFloat(data['oxygen saturation']),
      lengthofstay: parseFloat(data.lengthofstay),
      cholesterol: parseFloat(data.cholesterol),
      triglycerides: parseFloat(data.triglycerides),
      hba1c: parseFloat(data.hba1c),

      // Lifestyle
      smoking: parseFloat(data.smoking),
      alcohol: parseFloat(data.alcohol),
      physical_activity: parseFloat(data['physical activity']),
      diet_score: parseFloat(data['diet score']),
      family_history: parseFloat(data['family history']),
      stress_level: parseFloat(data['stress level']),
      sleep_hours: parseFloat(data['sleep hours']),

      // Demographics
      subject_birthyear: parseInt(data.subject_birthyear),
      subject_ageatfirstdraw: parseInt(data.subject_ageatfirstdraw),
      sample_drawyear: parseInt(data.sample_drawyear),
      sample_subjectageatdraw: parseInt(data.sample_subjectageatdraw),
      sample_dayssincefirstvisit: parseInt(data.sample_dayssincefirstvisit),

      // Anthropometric
      am_bmi: parseFloat(data.am_bmi),
      am_height: parseFloat(data.am_height),
      am_weight: parseFloat(data.am_weight),

      // Chemistry panel
      chem_alt: parseFloat(data.chem_alt),
      chem_albumin: parseFloat(data.chem_albumin),
      chem_alkaline_phosphatase: parseFloat(data.chem_alkaline_phosphatase),
      chem_ast: parseFloat(data.chem_ast),
      chem_t_bili: parseFloat(data.chem_t_bili),
      chem_bun: parseFloat(data.chem_bun),
      chem_calcium: parseFloat(data.chem_calcium),
      chem_co2: parseFloat(data.chem_co2),
      chem_cl: parseFloat(data.chem_cl),
      chem_creatinine: parseFloat(data.chem_creatinine),
      chem_egfr_aa: parseFloat(data.chem_egfr_aa),
      chem_egfr_non_aa: parseFloat(data.chem_egfr_non_aa),
      chem_globin: parseFloat(data.chem_globin),
      chem_glucose: parseFloat(data.chem_glucose),
      chem_potassium: parseFloat(data.chem_potassium),
      chem_protein: parseFloat(data.chem_protein),
      chem_sodium: parseFloat(data.chem_sodium),

      // Blood count
      bc_perc_basophils: parseFloat(data.bc_perc_basophils),
      bc_perc_eosinophils: parseFloat(data.bc_perc_eosinophils),
      bc_perc_lymphocytes: parseFloat(data.bc_perc_lymphocytes),
      bc_perc_monocytes: parseFloat(data.bc_perc_monocytes),
      bc_perc_neutrophils: parseFloat(data.bc_perc_neutrophils),
      bc_basophil_count: parseFloat(data.bc_basophil_count),
      bc_eosinophil_count: parseFloat(data.bc_eosinophil_count),
      bc_lymphocyte_count: parseFloat(data.bc_lymphocyte_count),
      bc_monocyte_count: parseFloat(data.bc_monocyte_count),
      bc_neutrophil_count: parseFloat(data.bc_neutrophil_count),
      bc_hematocrit: parseFloat(data.bc_hematocrit),
      bc_hemoglobin: parseFloat(data.bc_hemoglobin),
      bc_mch: parseFloat(data.bc_mch),
      bc_mchc: parseFloat(data.bc_mchc),
      bc_mcv: parseFloat(data.bc_mcv),
      bc_mpv: parseFloat(data.bc_mpv),
      bc_platelet_count: parseFloat(data.bc_platelet_count),
      bc_red_blood_cell_count: parseFloat(data.bc_red_blood_cell_count),
      bc_rdw: parseFloat(data.bc_rdw),
      bc_wbc: parseFloat(data.bc_wbc),

      // Immunology
      cmv_igg_serology: parseFloat(data.cmv_igg_serology),

      // Inflammation
      infl_anti_ccp3: parseFloat(data.infl_anti_ccp3),
      infl_anti_ccp31: parseFloat(data.infl_anti_ccp31),
      infl_hs_crp: parseFloat(data.infl_hs_crp),
      infl_rf_iga_result: parseFloat(data.infl_rf_iga_result),
      infl_rf_igm_result: parseFloat(data.infl_rf_igm_result),
      infl_esr: parseFloat(data.infl_esr),

      // Lipid panel
      lip_cholesterol_hdl: parseFloat(data.lip_cholesterol_hdl),
      lip_cholesterol_ldl: parseFloat(data.lip_cholesterol_ldl),
      lip_cholesterol_non_hdl: parseFloat(data.lip_cholesterol_non_hdl),
      lip_cholesterol_total: parseFloat(data.lip_cholesterol_total),
      lip_cholesterol_hdl_ratio: parseFloat(data.lip_cholesterol_hdl_ratio),
      lip_triglycerides: parseFloat(data.lip_triglycerides)
    };

    // Remove undefined/NaN values to save space
    return Object.fromEntries(
      Object.entries(transformed).filter(([_, v]) => v !== undefined && !Number.isNaN(v))
    );
  }

  /**
   * Search healthcare data
   */
  static async searchData(query, limit = 10) {
    try {
      const searchQuery = {};

      // Build dynamic search based on query terms
      if (query.condition) {
        searchQuery.medical_condition = { $regex: query.condition, $options: 'i' };
      }
      if (query.age) {
        searchQuery.age = { $gte: query.age.min || 0, $lte: query.age.max || 150 };
      }
      if (query.gender) {
        searchQuery.gender = query.gender;
      }
      if (query.hospital) {
        searchQuery.hospital = { $regex: query.hospital, $options: 'i' };
      }
      if (query.bloodType) {
        searchQuery.blood_type = query.bloodType;
      }

      const results = await HealthcareData.find(searchQuery).limit(limit).lean();
      return results;
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get patient by name
   */
  static async getPatientByName(name) {
    try {
      const patient = await HealthcareData.findOne({
        name: { $regex: name, $options: 'i' }
      }).lean();
      return patient;
    } catch (error) {
      throw new Error(`Patient lookup failed: ${error.message}`);
    }
  }

  /**
   * Get statistics by medical condition
   */
  static async getStatsByCondition(condition) {
    try {
      const stats = await HealthcareData.aggregate([
        {
          $match: {
            medical_condition: { $regex: condition, $options: 'i' }
          }
        },
        {
          $group: {
            _id: '$medical_condition',
            count: { $sum: 1 },
            avgAge: { $avg: '$age' },
            avgBMI: { $avg: '$bmi' },
            avgGlucose: { $avg: '$glucose' },
            avgCholesterol: { $avg: '$cholesterol' },
            maleCount: {
              $sum: {
                $cond: [{ $eq: ['$gender', 'male'] }, 1, 0]
              }
            },
            femaleCount: {
              $sum: {
                $cond: [{ $eq: ['$gender', 'female'] }, 1, 0]
              }
            }
          }
        }
      ]);

      return stats[0] || null;
    } catch (error) {
      throw new Error(`Stats calculation failed: ${error.message}`);
    }
  }

  /**
   * Get data insights for chatbot
   */
  static async getInsights(filters = {}) {
    try {
      const matchStage = {};

      if (filters.condition) {
        matchStage.medical_condition = { $regex: filters.condition, $options: 'i' };
      }

      const insights = await HealthcareData.aggregate([
        { $match: matchStage },
        {
          $facet: {
            totalRecords: [{ $count: 'count' }],
            ageDistribution: [
              {
                $group: {
                  _id: {
                    $cond: [
                      { $lt: ['$age', 30] },
                      '18-29',
                      {
                        $cond: [
                          { $lt: ['$age', 50] },
                          '30-49',
                          {
                            $cond: [{ $lt: ['$age', 70] }, '50-69', '70+']
                          }
                        ]
                      }
                    ]
                  },
                  count: { $sum: 1 }
                }
              }
            ],
            genderDistribution: [
              {
                $group: {
                  _id: '$gender',
                  count: { $sum: 1 }
                }
              }
            ],
            topHospitals: [
              {
                $group: {
                  _id: '$hospital',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ]
          }
        }
      ]);

      return insights[0] || {};
    } catch (error) {
      throw new Error(`Insights retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get database statistics
   */
  static async getDatabaseStats() {
    try {
      const totalRecords = await HealthcareData.countDocuments();
      const conditions = await HealthcareData.distinct('medical_condition');
      const hospitals = await HealthcareData.distinct('hospital');

      return {
        totalRecords,
        uniqueConditions: conditions.length,
        uniqueHospitals: hospitals.length,
        conditions: conditions.slice(0, 10),
        hospitals: hospitals.slice(0, 10)
      };
    } catch (error) {
      throw new Error(`Stats retrieval failed: ${error.message}`);
    }
  }
}

module.exports = HealthcareDataService;
