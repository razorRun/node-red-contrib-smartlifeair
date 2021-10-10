# README

### Quick summary -

This npm module will allow you to link up Smartlife and Tuya devices with node red via a **cloud service without any firmware changes**.

### How do I get set up?

### Please DO NOT use support email in app store to reach for support. Log issues and support requests on github.

1. <b>NOTE: This plugin is only conncted to our US DB, So please choose US (see the list below) on the app when you register.</b> Enroll the devices to <b>SmartLife AIR APP</b> (This is a separate app but you can use all the devices that works with tuya and smart life. If your device is not working or does not show inputs/outputs, try updating the firmware from app-> device -> update firmware)

- <b>Download SmartLife AIR APP</b> from Smartlife site, [One of the leading home automation companies in New Zealand](https://www.smartlife.nz/smartlife-labs).

2. Create an account under https://smartlife-air-plugins.smartlife.nz/ and add your SmartLife air credentials.
3. Install NodeRed node and add your https://smartlife-air-plugins.smartlife.nz/ Login credentials.
4. Choose the device, input and output. (Please change a status before you select the device, Backend has to receive at least one update in order to pop up in the list).
5. If you want to get last status without sending a command, you can do that by sending string "?" as a input

### More on Country limitation

There is one limitation on this plugin due to the server location. This node-red plugin only talks to US DB. That’s mean you will have to **choose a country that belongs to US region when you sign up to the mobile app**. Unfortunately, if you have already created an account you will have to create a new one and enrol devices again.

**Countries in the US region**
Canada, The United States, Peru, Mexico, Argentina, Brazil, Chile, Colombia, Venezuela, Malaysia, Indonesia, Philippines, New Zealand, Thailand, Japan, Korea, Vietnam, Myanmar(Burma), Guatemala, Bolivia, Ecuador, Paraguay, Suriname, Uruguay, Hongkong SAR China, Macao SAR China, Taiwan China, Puerto Rico, Curacao

### Contribution guidelines

- Writing tests TODO
- Code review
- Other guidelines

* Author - Roshan Milinda -> [roshan.digital](https://roshan.digital/)

### license GPL (GPLv3)
