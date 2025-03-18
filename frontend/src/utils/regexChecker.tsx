export default function regexChecker(value: string, type: string, pattern: string): { passed: boolean; missing: string[]; empty: boolean } {
    let missing: string[] = [];

    let result: { passed: boolean; missing: string[]; empty: boolean } = {
        passed: false,
        missing: [],
        empty: true
    }

    if (type === "password_login") {
        result.passed = true;
        result.empty = false;
        return result
    }

    if (value != "") {
        result.empty = false;
        if (pattern) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                result.passed = false;
            } else {
                result.passed = true;
            }
        }

        switch (type) {
            case "password_register":
                if (value.length < 5 || value.length > 32) {
                    missing.push(" - A length between 5 and 32 characters");
                }
                if (!value.match(/[0-9]/)) {
                    missing.push(" - At least one digit");
                }
                if (!value.match(/[a-z]/)) {
                    missing.push(" - At least one lowercase letter");
                }
                if (!value.match(/[A-Z]/)) {
                    missing.push(" - At least one uppercase letter");
                }
                if (!value.match(/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/)) {
                    missing.push(" - At least one special character");
                }
                break;
            case "username_register":
                if (value.length > 24) {
                    missing.push(" - Over 24 characters");
                }
                if (value.match(/[!@#$%^&*()+\=[\]{};':"\\|,<>/?]/)) {
                    missing.push(" - Any characters besides a-z, A-Z, 0-9, _ , - , .");
                } else if (!value.match(/^[a-zA-Z0-9._-]{1,24}$/)) {
                    missing.push(" - Any characters besides a-z, A-Z, 0-9, _ , - , .");
                }
                break;
        }
        result.missing = missing;
    }

    return result;
}