interface Validator {
    isEmail: (email: string) => boolean;
}

export class EmailValidator {
    public constructor(private _validator: Validator) {}

    public isValid(email: string): boolean {
        return this._validator.isEmail(email);
    }
}

const emailValidatorFactory = (result: boolean): EmailValidator => {
    const fakeValidator = { isEmail: (email: string): boolean => result };
    return new EmailValidator(fakeValidator);
};

describe("Email validadtor", () => {
    it("should return true if validator returns true", () => {
        const emailValidatorSUT = emailValidatorFactory(true);
        const isEmailValid = emailValidatorSUT.isValid("valid_email@mail.com");
        expect(isEmailValid).toBeTruthy();
    });

    it("should return false if validator returns false", () => {
        const emailValidatorSUT = emailValidatorFactory(false);
        const isEmailValid = emailValidatorSUT.isValid(
            "invalid_email@mail.com"
        );
        expect(isEmailValid).toBeFalsy();
    });

    it("should return false if validator returns false", () => {
        const emailValidatorSUT = emailValidatorFactory(false);
        const isEmailValid = emailValidatorSUT.isValid("any_email@mail.com");
        expect(isEmailValid).toBeFalsy();
    });
});
