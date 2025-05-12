const express = require("express");
const axios = require("axios");
const path = require("path");

const PORT = process.env.PORT || 3000;
const CBP_URL = "https://bwt.cbp.gov/api/waittimes";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/waittimes", async (req, res) => {
  try {
    const response = await axios.get(CBP_URL);
    const ports = response.data;

    const updated_at = new Date()

    const json_response = {
      updated_at
    }

    /**
     * Otay, passenger (not commercial)
     */
    const otay_mesa = ports.find(p => p.port_name === "Otay Mesa" && p.crossing_name === "Passenger")

    json_response.otay_mesa = {
      lanes: {
        car_lanes: {
          standard_lanes: {
            wait_minutes: otay_mesa.passenger_vehicle_lanes.standard_lanes.delay_minutes,
            lanes_open: otay_mesa.passenger_vehicle_lanes.standard_lanes.lanes_open,
            status: otay_mesa.passenger_vehicle_lanes.standard_lanes.operational_status,
          },
          sentri: {
            wait_minutes: otay_mesa.passenger_vehicle_lanes.NEXUS_SENTRI_lanes.delay_minutes,
            lanes_open: otay_mesa.passenger_vehicle_lanes.NEXUS_SENTRI_lanes.lanes_open,
            status: otay_mesa.passenger_vehicle_lanes.NEXUS_SENTRI_lanes.operational_status,
          },
          ready_lanes: {
            wait_minutes: otay_mesa.passenger_vehicle_lanes.ready_lanes.delay_minutes,
            lanes_open: otay_mesa.passenger_vehicle_lanes.ready_lanes.lanes_open,
            status: otay_mesa.passenger_vehicle_lanes.ready_lanes.operational_status,
          }
        }
      }
    }

    /**
     * San Ysidro, regular
     */
    const san_ysidro = ports.find(p => p.port_name === "San Ysidro" && p.crossing_name === "")

    json_response.san_ysidro = {
      lanes: {
        car_lanes: {
          standard_lanes: {
            wait_minutes: san_ysidro.passenger_vehicle_lanes.standard_lanes.delay_minutes,
            lanes_open: san_ysidro.passenger_vehicle_lanes.standard_lanes.lanes_open,
            status: san_ysidro.passenger_vehicle_lanes.standard_lanes.operational_status,
          },
          sentri: {
            wait_minutes: san_ysidro.passenger_vehicle_lanes.NEXUS_SENTRI_lanes.delay_minutes,
            lanes_open: san_ysidro.passenger_vehicle_lanes.NEXUS_SENTRI_lanes.lanes_open,
            status: san_ysidro.passenger_vehicle_lanes.NEXUS_SENTRI_lanes.operational_status,
          },
          ready_lanes: {
            wait_minutes: san_ysidro.passenger_vehicle_lanes.ready_lanes.delay_minutes,
            lanes_open: san_ysidro.passenger_vehicle_lanes.ready_lanes.lanes_open,
            status: san_ysidro.passenger_vehicle_lanes.ready_lanes.operational_status,
          }
        }
      }
    }

    res.json(json_response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch or parse wait times." });
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
