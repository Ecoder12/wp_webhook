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

    // Check if the record exists in Rajasthan_AC_Data
    const checkQuery = 'SELECT COUNT(*) AS count FROM Rajasthan_AC_Data WHERE MOBILE_NO = @mobileNo';
    const checkResult = await request.input('mobileNo', sql.VarChar, payload.receiver).query(checkQuery);

    const recordExists = checkResult.recordset[0].count > 0;

    if (recordExists) {
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
        @eventId,
        @senderId,
        @receiver,
        @displayName,
        @type,
        @textBody,
        @dt,
        @date,
        @created,
        @eventType,
        @whtsRefId,
        @from,
        @wabaNumber,
        @timestamp,
        @contextId,
        COALESCE(t.[State], ''),
        COALESCE(t.[AC_NO], ''),
        COALESCE(t.[PART_NO], ''),
        COALESCE(t.[SECTION_NO], ''),
        COALESCE(t.[SLNOINPART], ''),
        COALESCE(t.[C_HOUSE_NO], ''),
        COALESCE(t.[FM_NAME_EN], ''),
        COALESCE(t.[LASTNAME_EN], ''),
        COALESCE(t.[RLN_TYPE], ''),
        COALESCE(t.[RLN_FM_NM_EN], ''),
        COALESCE(t.[RLN_L_NM_EN], ''),
        COALESCE(t.[EPIC_NO], ''),
        COALESCE(t.[GENDER], ''),
        COALESCE(t.[AGE], ''),
        COALESCE(t.[DOB], '')
      FROM Rajasthan_AC_Data t
      WHERE t.MOBILE_NO = @receiver`;

      const result = await request
        .input('eventId', sql.VarChar, payload.id)
        .input('senderId', sql.VarChar, payload.sender_id)
        .input('receiver', sql.VarChar, payload.receiver)
        .input('displayName', sql.VarChar, payload.display_name)
        .input('type', sql.VarChar, payload.type)
        .input('textBody', sql.VarChar, payload.text.body)
        .input('dt', sql.VarChar, payload.dt)
        .input('date', sql.VarChar, payload.date)
        .input('created', sql.VarChar, payload.created)
        .input('eventType', sql.VarChar, payload.eventtype)
        .input('whtsRefId', sql.VarChar, payload.whts_ref_id)
        .input('from', sql.VarChar, payload.from)
        .input('wabaNumber', sql.VarChar, payload.wabaNumber)
        .input('timestamp', sql.VarChar, payload.timestamp)
        .input('contextId', sql.VarChar, payload.context.id)
        .query(query);

      res.status(200).json({ status: 200, message: 'Payload inserted successfully' });
    } else {
      // Execute another query or handle the case as needed
      const anotherQuery = `
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
      ,[context_id])
      VALUES
        (@eventId,
        @senderId,
        @receiver,
        @displayName,
        @type,
        @textBody,
        @dt,
        @date,
        @created,
        @eventType,
        @whtsRefId,
        @from,
        @wabaNumber,
        @timestamp,
        @contextId)`;

      const anotherResult = await request
        .input('eventId', sql.VarChar, payload.id)
        .input('senderId', sql.VarChar, payload.sender_id)
        .input('receiver', sql.VarChar, payload.receiver)
        .input('displayName', sql.VarChar, payload.display_name)
        .input('type', sql.VarChar, payload.type)
        .input('textBody', sql.VarChar, payload.text.body)
        .input('dt', sql.VarChar, payload.dt)
        .input('date', sql.VarChar, payload.date)
        .input('created', sql.VarChar, payload.created)
        .input('eventType', sql.VarChar, payload.eventtype)
        .input('whtsRefId', sql.VarChar, payload.whts_ref_id)
        .input('from', sql.VarChar, payload.from)
        .input('wabaNumber', sql.VarChar, payload.wabaNumber)
        .input('timestamp', sql.VarChar, payload.timestamp)
        .input('contextId', sql.VarChar, payload.context.id)
        .query(anotherQuery);

      res.status(301).json({ status: 200, message: 'Payload inserted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while inserting the payload' });
  }
});

app.listen(3500, () => {
  console.log('Server is running on port 3500');
});
