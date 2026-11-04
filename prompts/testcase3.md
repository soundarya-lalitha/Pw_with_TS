sample automation test case generation prompt

I have an API and i want to validate the response https://credit-api.ashysmoke-68387e15.westus.azurecontainerapps.io/v1/credit-reports
The x-api-key value is RvyVPky/sT1FUrt+eIGjGH0et0WhO0LE559pbEY19TY=
I would want the API request body to be populated from a csv file
The request body is below
{
    "callerId": "leadhouse-intake-web",
     "callerRequestId": "prod-smoke-004",
    "consumer": {
        "firstName": "{{firstName}}",
        "lastName": "{{lastName}}",
        "dob": "{{dob}}",
        "ssn": "{{ssn}}",
        "currentAddress": {
            "line1": "{{line1}}",
            "city": "{{city}}",
            "state": "{{state}}",
            "zipCode": "{{zipcode}}"
        }

        
    },
    "permissiblePurpose": "3F",
     "addOns": ["BASE_PROFILE"],
    "includeProductCodes": true
}

Above {firstName} etc should be read from a csv file with the same headers.
i want the response to be displayed

name of the script should be FirstAPI.tx
