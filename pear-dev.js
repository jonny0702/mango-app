import PearRuntime from 'pear-runtime';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  console.log("Iniciando Pear Runtime local...");
  try {
    const runtime = new PearRuntime({
      dir: __dirname,
      dev: true
    });
    
    // According to PearRuntime source, we can call runtime.run
    // PearRuntime.run is static, or runtime.run()
    // In pear-runtime/index.js: `run(entrypoint, args = [], opts = {}) { return this.constructor.run(entrypoint, args, opts) }`
    await runtime.run('.output/server/index.mjs', [], { dev: true });
    
    console.log("Servidor ejecutándose dentro de Pear Runtime.");
  } catch (error) {
    console.error("Error al iniciar pear-runtime:", error);
  }
}

run();
