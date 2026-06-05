import { HUSTLE_PROGRESSIONS, HustleNode } from '../src/config/hustleProgression';

interface PathInfo {
  hustleId: string;
  path: string[];
  totalCost: number;
  leafNode: HustleNode;
}

const errors: string[] = [];

function verifyHustle(hustleId: string, nodes: Record<string, HustleNode>) {
  const nodeIds = Object.keys(nodes);

  // Check for key mismatch
  nodeIds.forEach(key => {
    if (nodes[key].id !== key) {
      errors.push(`[${hustleId}] Node key mismatch: key "${key}" has id "${nodes[key].id}"`);
    }
  });

  const paths: PathInfo[] = [];

  function traverse(currentNodeId: string, currentPath: string[], currentCost: number, visited: Set<string>) {
    const node = nodes[currentNodeId];
    if (!node) {
      errors.push(`[${hustleId}] Missing node ID: ${currentNodeId} referenced in path ${currentPath.join(' -> ')}`);
      return;
    }

    if (visited.has(currentNodeId)) {
      errors.push(`[${hustleId}] Circular reference detected: ${Array.from(visited).join(' -> ')} -> ${currentNodeId}`);
      return;
    }

    if (node.cost < 0) {
      errors.push(`[${hustleId}] Invalid cost in node ${currentNodeId}: ${node.cost}`);
    }

    if (node.successChance < 0 || node.successChance > 1) {
      errors.push(`[${hustleId}] Invalid successChance in node ${currentNodeId}: ${node.successChance}`);
    }

    const newPath = [...currentPath, currentNodeId];
    const newCost = currentCost + node.cost;
    const newVisited = new Set(visited);
    newVisited.add(currentNodeId);

    if (node.nextNodes.length === 0) {
      paths.push({
        hustleId,
        path: newPath,
        totalCost: newCost,
        leafNode: node
      });
    } else {
      node.nextNodes.forEach(nextNodeId => {
        traverse(nextNodeId, newPath, newCost, newVisited);
      });
    }
  }

  if (nodes['l1']) {
    traverse('l1', [], 0, new Set());
  } else {
    errors.push(`[${hustleId}] Missing starting node l1`);
  }

  return paths;
}

const allPaths: PathInfo[] = [];

Object.entries(HUSTLE_PROGRESSIONS).forEach(([hustleId, nodes]) => {
  const paths = verifyHustle(hustleId, nodes);
  if (paths) {
    allPaths.push(...paths);
  }
});

console.log('--- Progression Paths ---');
allPaths.forEach(p => {
  console.log(`Hustle: ${p.hustleId}`);
  console.log(`Path: ${p.path.join(' -> ')}`);
  console.log(`Total Cost: $${p.totalCost.toLocaleString()}`);
  console.log(`Leaf Node Yields: Cash $${p.leafNode.yieldCash.toLocaleString()}, Clout ${p.leafNode.yieldClout}, Aura ${p.leafNode.yieldAura}`);
  console.log(`Leaf Node Success Chance: ${(p.leafNode.successChance * 100).toFixed(0)}%`);
  console.log(`Leaf Node Passive Monthly Yield: $${p.leafNode.passiveMonthlyYield.toLocaleString()}`);
  console.log('---------------------------');
});

if (errors.length > 0) {
  console.error('--- Errors Found ---');
  errors.forEach(err => console.error(err));
  process.exit(1);
} else {
  console.log('No errors found!');
}
