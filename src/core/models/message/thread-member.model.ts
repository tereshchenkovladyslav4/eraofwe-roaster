import { OrganizationType } from '@core/enums';

export interface ThreadMember {
    first_name: string;
    id: number;
    is_removed: boolean;
    last_name: string;
    org_id: number;
    org_type: OrganizationType;
    profile_pic: string;
    profile_pic_thumb: string;
    last_seen?: string;
    online?: boolean;
    user_id: number;
    computed_lastseen: string;
    computed_fullname: string;
    computed_profile_dp: string;
    computed_organization_name: string;
}
