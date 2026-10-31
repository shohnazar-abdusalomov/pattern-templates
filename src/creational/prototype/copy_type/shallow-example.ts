export class UserProfile {
  constructor(
    public username: string,
    public permissions: string[]
  ) {}

  // Shallow copy: inner array reference is shared!
  shallowCopy(): UserProfile {
    return new UserProfile(this.username, this.permissions);
  }

  // Deep copy: inner array reference is newly cloned!
  deepCopy(): UserProfile {
    return new UserProfile(this.username, [...this.permissions]);
  }
}

export function runShallowExampleDemo(): void {
  console.log('=== Prototype: Shallow vs Deep Copy Demo ===');
  const original = new UserProfile('alice', ['read', 'write']);
  
  const shallow = original.shallowCopy();
  shallow.permissions.push('admin');
  console.log('After mutating shallow.permissions:');
  console.log('Original permissions (affected!):', original.permissions);
  console.log('Shallow permissions:', shallow.permissions);

  const deep = original.deepCopy();
  deep.permissions.push('superadmin');
  console.log('\nAfter mutating deep.permissions:');
  console.log('Original permissions (unaffected):', original.permissions);
  console.log('Deep permissions:', deep.permissions);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runShallowExampleDemo();
}
