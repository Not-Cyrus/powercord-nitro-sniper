const { TextInput } = require('powercord/components/settings');
const { React } = require('powercord/webpack');

module.exports = ({ getSetting, updateSetting }) => (
    <div>
        <TextInput
            note="powercords gay and I have to manually ask for your token for this to work lmao"
            defaultValue={getSetting('Authorization', '')}
            required={true}
            onChange={val => updateSetting('Authorization', val)}
        >
            "Put your token here"
        </TextInput>
    </div>
);