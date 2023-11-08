const express = require('express');
const sql = require('mssql');

const app = express();

const config = {
  server: '182.77.57.62',
  port: 1433,
  database: 'voter',
  user: 'sa',
  password: 'Naxtre@124',
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
  requestTimeout: 600000
};

app.use(express.json());

app.post('/api/wp/webhookdata', async (req, res) => {
  const payload = req.body;
  console.log(payload);

  try {
    await sql.connect(config);

    const request = new sql.Request();

    const query = `
      INSERT INTO [dbo].[WP_Response]
      ([event_id]
      ,[sender_id]
      ,[receiver]
      ,[display_name]
      ,[type]
      ,[text_body]
      ,[dt]
      ,[date]
      ,[created]
      ,[eventtype]
      ,[whts_ref_id]
      ,[from_number]
      ,[waba_number]
      ,[timestamp]
      ,[context_id]
      ,[State]
      ,[AC_NO]
      ,[PART_NO]
      ,[SECTION_NO]
      ,[SLNOINPART]
      ,[C_HOUSE_NO]
      ,[FM_NAME_EN]
      ,[LASTNAME_EN]
      ,[RLN_TYPE]
      ,[RLN_FM_NM_EN]
      ,[RLN_L_NM_EN]
      ,[EPIC_NO]
      ,[GENDER]
      ,[AGE]
      ,[DOB])
      SELECT
        '${payload.id}',
        '${payload.sender_id}',
        '${payload.receiver}',
        '${payload.display_name}',
        '${payload.type}',
        '${payload.text.body}',
        '${payload.dt}',
        '${payload.date}',
        '${payload.created}',
        '${payload.eventtype}',
        '${payload.whts_ref_id}',
        '${payload.from}',
        '${payload.wabaNumber}',
        '${payload.timestamp}',
        '${payload.context.id}',
        t.[State],
        t.[AC_NO],
        t.[PART_NO],
        t.[SECTION_NO],
        t.[SLNOINPART],
        t.[C_HOUSE_NO],
        t.[FM_NAME_EN],
        t.[LASTNAME_EN],
        t.[RLN_TYPE],
        t.[RLN_FM_NM_EN],
        t.[RLN_L_NM_EN],
        t.[EPIC_NO],
        t.[GENDER],
        t.[AGE],
        t.[DOB]
      FROM Rajasthan_AC_Data t
      WHERE t.MOBILE_NO = '${payload.receiver}'`;

    const result = await request.query(query);

    res.status(200).json({ message: 'Payload inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while inserting the payload' });
  }
});

app.listen(3500, () => {
  console.log('Server is running on port 3500');
});
