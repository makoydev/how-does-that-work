import path from 'node:path';

/**
 * Files an Exhibit may import from outside its own folder, besides Three.js.
 * Keep this list tiny: it is the whole surface an agent-written Exhibit can
 * touch. See ADR 0001.
 */
const SHARED_ALLOWLIST = ['src/shared/palette', 'src/shared/exhibitContract'];

/**
 * ESLint plugin with one rule: code under `src/exhibits/<slug>/` may import
 * only Three.js, the shared palette, the Exhibit contract types, and files
 * inside its own folder. Everything else, including the Hall, the App, and
 * other Exhibits, is an error.
 */
export const exhibitIsolation = {
  meta: { name: 'exhibit-isolation' },
  rules: {
    'only-allowed-imports': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Exhibits import only Three.js, the shared palette, the Exhibit contract, and their own folder (ADR 0001).',
        },
        schema: [],
        messages: {
          forbidden:
            'Exhibit "{{slug}}" may not import "{{source}}". Exhibits import only Three.js, the shared palette, the Exhibit contract types, and files in their own folder (ADR 0001).',
        },
      },
      create(context) {
        const exhibitsDir = path.join(context.cwd, 'src', 'exhibits');
        const slug = path.relative(exhibitsDir, context.filename).split(path.sep)[0];
        const exhibitDir = path.join(exhibitsDir, slug);
        const sharedAllowlist = SHARED_ALLOWLIST.map((file) => path.join(context.cwd, file));

        const isAllowed = (source) => {
          if (source === 'three' || source.startsWith('three/')) return true;
          if (!source.startsWith('.')) return false;
          const resolved = path.resolve(path.dirname(context.filename), source);
          if (resolved.startsWith(exhibitDir + path.sep)) return true;
          const withoutExtension = resolved.replace(/\.(ts|js)$/, '');
          return sharedAllowlist.includes(withoutExtension);
        };

        const check = (sourceNode) => {
          if (!sourceNode || typeof sourceNode.value !== 'string') return;
          if (isAllowed(sourceNode.value)) return;
          context.report({
            node: sourceNode,
            messageId: 'forbidden',
            data: { slug, source: sourceNode.value },
          });
        };

        return {
          ImportDeclaration: (node) => check(node.source),
          ExportNamedDeclaration: (node) => check(node.source),
          ExportAllDeclaration: (node) => check(node.source),
          ImportExpression: (node) => check(node.source),
        };
      },
    },
  },
};
