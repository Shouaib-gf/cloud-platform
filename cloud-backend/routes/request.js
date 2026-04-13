const router = require("express").Router();
const Request = require("../models/Request");
const triggerJenkins = require("../utils/jenkins");
const { exec } = require("child_process");

/* =========================
   🟢 CREATE REQUEST
========================= */
router.post("/create", async (req, res) => {
  try {
    const { vm_name, plan, userId } = req.body;

    const request = new Request({
      vm_name,
      plan,
      userId,
      status: "waiting"
    });

    await request.save();

    res.json({ message: "Request sent ⏳" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create request" });
  }
});

/* =========================
   📋 GET USER VMs
========================= */
router.get("/user/:userId", async (req, res) => {
  try {
    const data = await Request.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user VMs" });
  }
});

/* =========================
   📋 GET ALL (ADMIN)
========================= */
router.get("/all", async (req, res) => {
  try {
    const data = await Request.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all VMs" });
  }
});

/* =========================
   🚀 APPROVE REQUEST
========================= */
router.post("/approve/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 🔄 set status deploying
    request.status = "deploying";
    await request.save();

    // 🚀 trigger Jenkins
    await triggerJenkins(request.vm_name, request.plan);

    console.log("⏳ Waiting for Terraform...");

    // ⏳ wait for terraform to finish
    setTimeout(() => {

      const path = `/opt/cloud-platform/deployments/${request.vm_name}`;

      console.log("Reading Terraform output from:", path);

      exec(
        `terraform -chdir=${path} output vm_ip`,
        async (err, stdout, stderr) => {

          if (err) {
            console.error("❌ Terraform error:", err.message);
            return;
          }

          try {
            console.log("Terraform output:", stdout);

            // 🔥 extract IP
            const match = stdout.match(/192\\.168\\.\\d+\\.\\d+/);

            if (match) {
              request.vm_ip = match[0];
              request.status = "accepted";

              await request.save();

              console.log("✅ VM ready with IP:", match[0]);
            } else {
              console.log("⚠️ No IP found in output");
            }

          } catch (e) {
            console.error("❌ Parsing error:", e);
          }
        }
      );

    }, 60000); // wait 60s

    res.json({ message: "VM deployment started 🚀" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve request" });
  }
});

module.exports = router;
