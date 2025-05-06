const axios = require("axios");

const nodeUrls = (process.env.NODE_URLS || "").split(",").filter(Boolean);

if (nodeUrls.length === 0) {
  throw new Error("NODE_URLS environment variable is not defined or empty.");
}
let currentNodeIndex = 0;

const getNextNodeUrl = () => {
  currentNodeIndex = (currentNodeIndex + 1) % nodeUrls.length;
  return nodeUrls[currentNodeIndex];
};

const proxyHandler = async (req, res) => {
  let retries = 3;
  let response;
  let success = false;

  while (!success && retries > 0) {
    const url = getNextNodeUrl();

    try {
      response = await axios.post(url, req.body, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000
      });
      success = true;
    } catch (err) {
      console.error(`Error with node ${url}:`, err.message);
      retries--;
    }
  }

  if (!success) {
    return res.status(502).json({ error: "All node URLs failed." });
  }

  return res.json(response.data);
};

module.exports = proxyHandler;
