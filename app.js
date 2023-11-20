const express = require('express');
const sql = require('mssql');
const ejs = require('ejs');


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
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('form');
});
app.post('/api/wp/webhookdata', async (req, res) => {
  const payload = req.body;
  console.log(payload);
  console.log('>>>>>>>>>>>>', payload.text.body)

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
        .input('textBody', sql.NVarChar, payload.text.body)
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
        .input('textBody', sql.NVarChar, payload.text.body)
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

//[WP_Response_2]
app.post('/api/wp/webhookdata_2', async (req, res) => {
  const payload = req.body;
  console.log(payload);

  try {
    await sql.connect(config);
    const request = new sql.Request();

    const checkQuery = 'SELECT COUNT(*) AS count FROM Rajasthan_AC_Data WHERE MOBILE_NO = @mobile_t';
    const checkResult = await request.input('mobile_t', sql.VarChar, payload.mobile).query(checkQuery);
    const recordExists = checkResult.recordset[0].count > 0;

    if (recordExists) {
      const query = `
        INSERT INTO [dbo].[WP_Response_2]
        ([waNumber], [mobile], [replyId], [messageId], [text], [name], [type],[button_reply] [timestamp], [State], [AC_NO], [PART_NO], [SECTION_NO], [SLNOINPART], [C_HOUSE_NO], [FM_NAME_EN], [LASTNAME_EN], [RLN_TYPE], [RLN_FM_NM_EN], [RLN_L_NM_EN], [EPIC_NO],[GENDER], [AGE], [DOB])
        SELECT
          @waNumber,
          @mobile,
          @replyId,
          @messageId,
          @text,
          @name,
          @type,
          @button_reply
          @timestamp,
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
        WHERE MOBILE_NO = @mobile`;

      const result = await request
        .input('waNumber', sql.VarChar, payload.waNumber)
        .input('mobile', sql.VarChar, payload.mobile)
        .input('replyId', sql.VarChar, payload.replyId)
        .input('messageId', sql.VarChar, payload.messageId)
        .input('text', sql.NVarChar, payload.text)
        .input('name', sql.NVarChar, payload.name)
        .input('type', sql.VarChar, payload.type)
        .input('button_reply', sql.NVarChar, payload.button.text)
        .input('timestamp', sql.VarChar, new Date().toISOString())
        .query(query);

      res.status(200).json({ status: 200, message: 'Payload inserted successfully' });
    } else {
      const anotherQuery = `
        INSERT INTO [dbo].[WP_Response_2]
        ([waNumber], [mobile], [replyId], [messageId], [text], [name], [type],[button_reply], [timestamp])
        VALUES
        (@waNumber, @mobile, @replyId, @messageId, @text, @name, @type, @button_reply, @timestamp)`;
        let jsonObject = null;
        const jsonString = payload.button;

        if (typeof jsonString === 'string') {
            const cleanedString = jsonString.replace(/\\"/g, '"').replace(/"{/g, '{').replace(/}"/g, '}');
            jsonObject = JSON.parse(cleanedString);
        } else {
            
            jsonObject = null;
        }
    
        if (typeof jsonObject === 'undefined') {
            jsonObject = null;
        }
      const anotherResult = await request
        .input('waNumber', sql.VarChar, payload.waNumber)
        .input('mobile', sql.VarChar, payload.mobile)
        .input('replyId', sql.VarChar, payload.replyId)
        .input('messageId', sql.VarChar, payload.messageId)
        .input('text', sql.NVarChar, payload.text)
        .input('name', sql.NVarChar, payload.name)
        .input('type', sql.VarChar, payload.type)
        .input('button_reply', sql.NVarChar, jsonObject?.text || null)
        .input('timestamp', sql.VarChar, new Date().toISOString())
        .query(anotherQuery);

      res.status(301).json({ status: 200, message: 'Payload inserted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while inserting the payload' });
  }
});

app.get('/response/:min/:max', async (req, res) => {
  try {
    const min = req.params.min;
    const max = req.params.max;
    await sql.connect(config);
    const request = new sql.Request();

    const query = `
    SELECT * 
    FROM (
        SELECT *, 
            ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS rowNum 
        FROM WP_Response 
    ) AS tbl
    WHERE rowNum BETWEEN ${min} AND ${max};`;

    const result = await request.query(query);

    const query_count = `
    SELECT count(*) as totalRow FROM WP_Response `

    const result_count = await request.query(query_count);
    // console.log('Data Fetched Successfully', result);

    res.json({ data: result.recordset , datacount: result_count.recordsets[0] });
  } catch (error) {
    console.error(error);
  } finally {
    sql.close();
  }
});


app.get('/response-gupshup/:min/:max', async (req, res) => {
  try {
    const min = req.params.min;
    const max = req.params.max;
    await sql.connect(config);
    const request = new sql.Request();

    const query = `
    SELECT * 
    FROM (
        SELECT *, 
            ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS rowNum 
        FROM WP_Response_2 
    ) AS tbl
    WHERE rowNum BETWEEN ${min} AND ${max};`;

    const result = await request.query(query);

    const query_count = `
    SELECT count(*) as totalRow FROM WP_Response_2 `

    const result_count = await request.query(query_count);
    // console.log('Data Fetched Successfully', result);

    res.json({ data: result.recordset , datacount: result_count.recordsets[0] });
  } catch (error) {
    console.error(error);
  } finally {
    sql.close();
  }
});



app.listen(3500, () => {
  console.log('Server is running on port 3500');
});
