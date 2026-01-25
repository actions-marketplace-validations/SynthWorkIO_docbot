import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeProject } from './analyzer';
import { generateDocs, GeneratorMode } from './generator';

async function run(): Promise<void> {
  try {
    // Get inputs
    const mode = (core.getInput('mode') || 'readme') as GeneratorMode;
    const apiKey = core.getInput('api-key');
    const outputPath = core.getInput('output-path') || '.';
    
    // Check for API key in environment
    const hasAIKey = !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || apiKey);
    
    if (apiKey) {
      process.env.OPENAI_API_KEY = apiKey;
    }

    core.info(`🔍 Analyzing project...`);
    const workspaceDir = process.env.GITHUB_WORKSPACE || process.cwd();
    const projectInfo = await analyzeProject(workspaceDir);
    
    core.info(`📦 Project: ${projectInfo.name} (${projectInfo.language})`);
    core.info(`📄 Found ${projectInfo.sourceFiles.length} source files`);
    
    core.info(`✍️ Generating documentation (mode: ${mode}, AI: ${hasAIKey})...`);
    const docs = await generateDocs(projectInfo, mode, hasAIKey);
    
    // Write README
    const readmePath = path.join(outputPath, 'README.md');
    fs.writeFileSync(readmePath, docs.readme);
    core.info(`✅ Generated ${readmePath}`);
    
    const updatedFiles = [readmePath];
    
    // Write API docs if generated
    if (docs.api) {
      const apiPath = path.join(outputPath, 'docs', 'API.md');
      fs.mkdirSync(path.dirname(apiPath), { recursive: true });
      fs.writeFileSync(apiPath, docs.api);
      core.info(`✅ Generated ${apiPath}`);
      updatedFiles.push(apiPath);
    }
    
    // Set outputs
    core.setOutput('files-updated', updatedFiles.join(','));
    
    core.info(`🎉 Documentation generated successfully!`);
    
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();
