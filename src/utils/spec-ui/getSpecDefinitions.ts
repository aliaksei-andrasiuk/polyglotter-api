import fs from 'fs';
import jsYaml from 'js-yaml';
import path from 'path';

const getSpecDefinitions = async (specPath: string) => {
    const yamlSpec = await fs.promises.readFile(path.resolve(specPath), 'utf-8');

    return jsYaml.load(yamlSpec);
};

export default getSpecDefinitions;
