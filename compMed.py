import boto3
import json

def lambda_handler(event, context):
    comprehend_medical = boto3.client('comprehendmedical', region_name='us-west-2')
    text = event.get('text', '')  # Ensure the input text is passed in the event

    if not text:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No text provided'})
        }

    try:
        responseEnt = comprehend_medical.detect_entities_v2(Text = text)
        responseRx = comprehend_medical.infer_rx_norm(Text = text)
        responseICD = comprehend_medical.infer_icd10_cm(Text=text)
        responseSNO = comprehend_medical.infer_snomedct(Text = text)
        ##medical_entities = response['Entities']

        return {
            'statusCode': 200,
            'body': json.dumps({
                "Entities": responseEnt,
                "Medications": responseRx,
                "ICD10_CM": responseICD,
                "SNOMED_CT": responseSNO  # Uncomment if using SNOMED CT
            })

        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }


