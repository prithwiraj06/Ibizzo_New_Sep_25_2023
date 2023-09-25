export class BusinessCategory {
    businessCategoryInfo: [
        {
            id:string,
            name:string
        }
    ]    
};

export class SocialOrganisation {
    socialOrganizationInfo: [
        {
            id: number,
            name: string
        }
    ]
};

export class ApprovedOrganization {
    socialOrganizationInfo: [
        {
            id: number;
            name: string;
        }
    ]
};

export class Register {
    isRegistard:boolean;
};

export class AutoSuggestProduct {
    "selectedValue":string;
    "selectedID":string;
    "_source": {
      "product_unspsc_code": string,
      "product_unspsc_Name": string
    }
};

export class AutoSuggestDBProduct {
    "selectedValue":string;
    "selectedID":string;
    "_source": {
        "product_code": "string",
        "product_Name": "string"
    }
};

export class GetUserName {
    "isAuthenticated": boolean;
    "userName": string
};

export class GetOrganization {
    "otherOrganizationInfo": [
        {
          "organizationId": string;
          "nonOrganizationId": string;
          "name": string
        }
    ]
};

export class GetCustomOrganization {
    "socialOrganizationInfo": [
        {
            "id": string;
            "name": string;
        }
    ]
};