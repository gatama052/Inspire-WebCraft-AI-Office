import { Vector3D, WaypointNode } from '../types/office';
import { WAYPOINTS } from '../constants/officeData';

export function distance3D(a: Vector3D, b: Vector3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function distance2D(a: Vector3D, b: Vector3D): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Finds the closest waypoint in the graph to any 3D coordinate
 */
export function findNearestWaypointId(
  position: Vector3D,
  predicate?: (node: WaypointNode) => boolean
): string {
  let closestId = 'wp_corridor_center';
  let minDistance = Infinity;

  for (const [id, node] of Object.entries(WAYPOINTS)) {
    if (predicate && !predicate(node)) continue;
    const d = distance2D(position, node.position);
    if (d < minDistance) {
      minDistance = d;
      closestId = id;
    }
  }

  return closestId;
}

/**
 * A* Pathfinding implementation on the Waypoint Graph
 */
export function findPathAStar(startNodeId: string, targetNodeId: string): string[] | null {
  if (startNodeId === targetNodeId) {
    return [startNodeId];
  }

  const startNode = WAYPOINTS[startNodeId];
  const targetNode = WAYPOINTS[targetNodeId];

  if (!startNode || !targetNode) {
    return null;
  }

  const openSet = new Set<string>([startNodeId]);
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  gScore.set(startNodeId, 0);

  const fScore = new Map<string, number>();
  fScore.set(startNodeId, distance2D(startNode.position, targetNode.position));

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentId: string | null = null;
    let lowestF = Infinity;

    for (const nodeId of openSet) {
      const score = fScore.get(nodeId) ?? Infinity;
      if (score < lowestF) {
        lowestF = score;
        currentId = nodeId;
      }
    }

    if (!currentId) break;

    // Reached destination!
    if (currentId === targetNodeId) {
      const path: string[] = [currentId];
      let curr = currentId;
      while (cameFrom.has(curr)) {
        curr = cameFrom.get(curr)!;
        path.unshift(curr);
      }
      return path;
    }

    openSet.delete(currentId);
    const currentNode = WAYPOINTS[currentId];
    if (!currentNode) continue;

    for (const neighborId of currentNode.connectedNodeIds) {
      const neighborNode = WAYPOINTS[neighborId];
      if (!neighborNode) continue;

      const tentativeG = (gScore.get(currentId) ?? Infinity) + distance2D(currentNode.position, neighborNode.position);

      if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeG);
        fScore.set(neighborId, tentativeG + distance2D(neighborNode.position, targetNode.position));

        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        }
      }
    }
  }

  // No path found
  return null;
}
