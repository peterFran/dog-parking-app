# OpenAPI Type Generation

This project uses `openapi-typescript` to automatically generate TypeScript types from the backend API's OpenAPI specification.

## Overview

All API types are generated from the OpenAPI spec and stored in `src/types/api.ts`. These types provide full type safety for API requests and responses.

## Generated Types Location

- **Generated types**: `src/types/api.ts`
- **Type exports**: `src/lib/api-client.ts` (convenient re-exports)

## Usage

### In API Client

The `ApiClient` class uses generated types for all methods:

```typescript
import { components } from '../types/api';

// Type aliases for convenience
export type Dog = components['schemas']['DogResponse'];
export type DogRequest = components['schemas']['DogRequest'];
```

### In React Hooks

Import types from the API client:

```typescript
import { Dog, DogRequest } from '../lib/api-client';

const { data: dogs = [] } = useDogs(); // dogs: Dog[]
const createDog = useCreateDog(); // accepts DogRequest
```

### In Components

```typescript
import { DogRequest } from '../lib/api-client';

const handleAddDog = async (dogData: DogRequest) => {
  await createDogMutation.mutateAsync(dogData);
};
```

## Regenerating Types

When the backend API changes, regenerate types with:

```bash
npm run generate:types
```

This fetches the latest OpenAPI spec from the staging API and updates `src/types/api.ts`.

## Key Type Mappings

### Dog Types
- `DogRequest` - Create/update dog payload (snake_case fields)
- `DogResponse` (`Dog`) - Dog data from API (includes id, timestamps)
- `DogListResponse` - List of dogs with count

### Size Values
API uses uppercase enums: `SMALL`, `MEDIUM`, `LARGE`, `XLARGE`

### Vaccination Status
API uses: `VACCINATED` or `NOT_VACCINATED`

### Field Naming
The API uses snake_case:
- `date_of_birth` (not `birthDate`)
- `special_needs` (not `specialNeeds`)
- `vaccination_status` (not `vaccinated`)
- `medical_notes`, `behavior_notes`, `favorite_activities`

## Benefits

1. **Type Safety**: Catch API contract mismatches at compile time
2. **Auto-completion**: Full IntelliSense for all API types
3. **Documentation**: JSDoc comments from OpenAPI spec
4. **Single Source of Truth**: Backend OpenAPI spec drives frontend types
5. **Validation**: TypeScript ensures payloads match API expectations

## Migration Notes

The old manual types in `src/types/dog.ts` have been replaced with generated types. Components now use the properly typed API responses directly without transformation layers.
