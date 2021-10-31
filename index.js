const { TranscribeClient, StartTranscriptionJobCommand } = require('@aws-sdk/client-transcribe');

exports.handler = async (event) => {
    const REGION = "us-east-1";
    const transcribeClient = new TranscribeClient({ region: REGION });
    //console.log('>>>>>>>>>> Received event:', JSON.stringify(event, null, 2));
    
    var objeto = event.Records[0].s3.object.key;
    var spobt = objeto.split('_');
    var uid_firebase = spobt[0];
    var manticore = spobt[1];
    var uid_file = spobt[2];
    var timename_file = spobt[5];
    var idioma = spobt[3] +'-'+ spobt[4];
    var idioma_path = spobt[3] +'_'+ spobt[4];
    var timenow = Date.now();
    const params = {
      TranscriptionJobName: `${uid_firebase}-${timenow}`,
      LanguageCode: idioma,
      MediaFormat: "flac",
      Media: {
        MediaFileUri: `https://verbana.s3.amazonaws.com/${uid_firebase}_${manticore}_${uid_file}_${idioma_path}_${timename_file}`,
      },
      OutputBucketName: `verbana-output`,
      Subtitles: {
        Formats:["srt"]//["srt", "vtt"]
      }
    };
    try {
        const data = await transcribeClient.send(
            new StartTranscriptionJobCommand(params),
        );
        console.log("Success - put", data);
        return data; // For unit tests.
    } catch (err) {
        console.log("Error", err);
        return "error";
    }
};
