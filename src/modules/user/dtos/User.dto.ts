export class RequestNewCode {}

export class UserConfirmationAuth extends RequestNewCode {}

export class UserSuccessResponse extends RequestNewCode {}

export class UserSessionPayload extends UserSuccessResponse {}

export class UserAuth extends RequestNewCode {}

export class CreateUser extends UserAuth {}
