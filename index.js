const { post } = require('powercord/http');
const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const Settings = require('./components/Settings');

const NitroRegex  = new RegExp(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)[^\s]+/gim);
const NitroReplace = new RegExp(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)/gim);

module.exports = class CysNitroSniper extends Plugin {    
    async startPlugin(){

        let usedCodes = [];

        this.loadStylesheet('styles.css');
        this.registerSettings();

        const { default: MessageRender } = await getModule(["getElementFromMessageId"]);

        const Authorization = this.settings.get("Authorization","")
        
        inject("CysNitroSniper$MessageRender", MessageRender, "type", async args => {
        if (!Authorization) {
            return;
        }

        const [{message}] = args;

        let nitroCodes = message.content.match(NitroRegex);

        if (!nitroCodes || !nitroCodes.length) return; 

        for (let nitroCode of nitroCodes) {
            nitroCode = nitroCode.replace(NitroReplace, "").replace(/\W/g, '');

            if (usedCodes.includes(nitroCode)) {
                continue;
            }
            usedCodes.push(nitroCode)

            if (nitroCode.length < 16 || nitroCode.length > 24) {
                continue;
            }

            await post(`https://discord.com/api/v6/entitlements/gift-codes/${nitroCode}/redeem`)
                .set("Authorization",Authorization)
                
            }
        }, true);
    }

    pluginWillUnload(){
        powercord.api.settings.unregisterSettings("CysNitroSniper-settings")
        uninject("CysNitroSniper$MessageRender");
    }

    registerSettings(){
        powercord.api.settings.registerSettings("CysNitroSniper-settings", {
            category: this.entityID,
            label: "Cy's Nitro Sniper",
            render: Settings,
        });
    };
}