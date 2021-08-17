const amf = require('amf-client-js');
const { parse } = require('path');
const path = require('path');

amf.plugins.document.WebApi.register();
amf.plugins.document.Vocabularies.register();
amf.plugins.features.AMFCustomValidation.register();

async function parseRaml(sourceFile) {
    const type = 'RAML 1.0';
    const contentType = 'application/raml';

    await amf.AMF.init();
    const parser = amf.Core.parser(type, contentType);
    let model = await parser.parseFileAsync(`file://${sourceFile}`);

    return amf.Core.resolver(type).resolve(model, "editing");
}

function listCustomProperties(webApi) {
    for (const endpoint of webApi.endPoints) {
        console.log(endpoint.path.value());
        for (const op of endpoint.operations) {
            console.log('  ', op.method.value());
            if (op.customDomainProperties.length) {
                for (const customProperty of op.customDomainProperties) {
                    console.log(`     ${customProperty.name.value()}`);
                }
            }
        }
    }
}

(async () => {
    let model = await parseRaml(path.join(__dirname, 'api_tags.raml'))
    let webApi = model.encodes;
    listCustomProperties(webApi);
    console.log('---------------');
    model = await parseRaml(path.join(__dirname, 'api_xtags.raml'))
    webApi = model.encodes;
    listCustomProperties(webApi);
})();