const axios = require("axios");

const JENKINS_URL = "http://192.168.159.157:8080";
const JOB_NAME = "Cloud-Deploy-Pipeline";
const USER = "admin";
const TOKEN = "11f7f6875c66b45821e8cdfd6f20b8b827"; // ⚠️ replace

module.exports = async (vm_name, plan) => {
  try {
    // 🔥 generate valid VM ID (>100)
    const vm_id = Math.floor(Math.random() * 1000) + 100;

    let cpu = 2, ram = 2048, disk = 30;

    if (plan === "premium") {
      cpu = 4; ram = 4096; disk = 50;
    }

    if (plan === "enterprise") {
      cpu = 8; ram = 8192; disk = 100;
    }

    console.log("Triggering Jenkins with:", {
      vm_name,
      vm_id,
      cpu,
      ram,
      disk
    });

    // 🔐 get crumb
    const crumbRes = await axios.get(
      `${JENKINS_URL}/crumbIssuer/api/json`,
      {
        auth: {
          username: USER,
          password: TOKEN
        }
      }
    );

    const crumbField = crumbRes.data.crumbRequestField;
    const crumb = crumbRes.data.crumb;

    // 🚀 trigger pipeline
    await axios.post(
      `${JENKINS_URL}/job/${JOB_NAME}/buildWithParameters`,
      null,
      {
        params: {
          VM_NAME: vm_name,
          VM_ID: vm_id,
          CPU: cpu,
          RAM: ram,
          DISK: disk
        },
        auth: {
          username: USER,
          password: TOKEN
        },
        headers: {
          [crumbField]: crumb
        }
      }
    );

    console.log("✅ Jenkins job triggered");

  } catch (err) {
    console.error("❌ Jenkins error:", err.response?.data || err.message);
    throw err;
  }
};
