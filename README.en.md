# Ozon Unit Price

[Русская версия](README.md) | **English**

[![Latest Release](https://img.shields.io/github/v/release/thejohnd0e/ozon-unit-price?display_name=tag&sort=semver)](https://github.com/thejohnd0e/ozon-unit-price/releases) [![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/) [![Manifest V3](https://img.shields.io/badge/Manifest-V3-34A853)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

A dependency-free Chrome extension that helps compare Ozon products by showing a normalized price for weight and volume.

![Ozon Unit Price preview](images/readme.png)

The repository includes the quantity parser, unit-price calculator, Manifest V3 package definition, popup settings surface, and Ozon content integration.

## Supported formats

The calculation layer supports:

- weight in grams and kilograms;
- volume in milliliters and liters;
- decimal commas and decimal points;
- ranges such as `400–600 г`;
- multipacks such as `4 × 100 г` and `6 bottles of 200 ml`;
- display as `₽/kg` and `₽/l` (default);
- display as `₽/100 g` and `₽/100 ml`;
- both display scales at once.

## Install in Chrome

1. Download the archive from [Releases](https://github.com/thejohnd0e/ozon-unit-price/releases).
2. Extract it into a separate folder.
3. Open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Select **Load unpacked**.
6. Select the extracted folder.
7. Open Ozon and pin the extension in Chrome.

## Settings

Click the extension icon to choose how the unit price is displayed. Settings are synchronized through Chrome and stored locally in the browser.

## Security and privacy

- All parsing and calculation run locally in the browser.
- Product and settings data are not sent to a server.
- The extension does not use analytics or third-party services.
- Access to pages is limited to Ozon domains.
