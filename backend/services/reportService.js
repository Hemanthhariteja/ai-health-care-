const Report = require('../models/Report');
const fs = require('fs').promises;

const analyzeReport = (fileName, fileType) => {
  const simplifiedAnalysis = `Based on the uploaded report, we have processed your medical document. This is a general overview of the information contained in your ${fileType} file.`;

  const detailedAnalysis = `Detailed Analysis:\n\n` +
    `1. Document Type: Medical Report (${fileType})\n` +
    `2. Processing Date: ${new Date().toLocaleDateString()}\n` +
    `3. File Name: ${fileName}\n\n` +
    `Key Points:\n` +
    `- All values have been recorded and stored securely\n` +
    `- This is a mock analysis for demonstration purposes\n` +
    `- For actual medical interpretation, please consult with your healthcare provider\n` +
    `- Share this report with your doctor during your next consultation\n\n` +
    `Recommendations:\n` +
    `- Keep a copy of all medical reports for your records\n` +
    `- Discuss any concerns with a qualified healthcare professional\n` +
    `- Regular health check-ups are important for preventive care`;

  const keywords = ['medical', 'report', 'health', 'analysis', 'results'];

  return {
    simplified: simplifiedAnalysis,
    detailed: detailedAnalysis,
    keywords,
    status: 'completed'
  };
};

const uploadReport = async (userId, fileData) => {
  const { filename, originalname, mimetype, size, path } = fileData;

  const report = await Report.create({
    userId,
    fileName: filename,
    originalName: originalname,
    fileType: mimetype,
    fileSize: size,
    filePath: path,
    uploadDate: new Date(),
    analysis: {
      status: 'processing'
    }
  });

  setTimeout(async () => {
    const analysis = analyzeReport(originalname, mimetype);
    report.analysis = analysis;
    await report.save();
  }, 2000);

  return {
    reportId: report._id,
    fileName: report.originalName,
    fileSize: report.fileSize,
    uploadDate: report.uploadDate,
    status: 'processing'
  };
};

const getReport = async (reportId, userId) => {
  const report = await Report.findOne({ _id: reportId, userId });

  if (!report) {
    throw new Error('Report not found');
  }

  return {
    reportId: report._id,
    fileName: report.originalName,
    fileType: report.fileType,
    fileSize: report.fileSize,
    uploadDate: report.uploadDate,
    analysis: report.analysis,
    metadata: report.metadata
  };
};

const getUserReports = async (userId, limit = 20) => {
  const reports = await Report.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return reports.map(report => ({
    reportId: report._id,
    fileName: report.originalName,
    fileType: report.fileType,
    fileSize: report.fileSize,
    uploadDate: report.uploadDate,
    analysisStatus: report.analysis.status
  }));
};

const deleteReport = async (reportId, userId) => {
  const report = await Report.findOne({ _id: reportId, userId });

  if (!report) {
    throw new Error('Report not found');
  }

  try {
    await fs.unlink(report.filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }

  await Report.findByIdAndDelete(reportId);

  return { message: 'Report deleted successfully' };
};

module.exports = {
  uploadReport,
  getReport,
  getUserReports,
  deleteReport
};
