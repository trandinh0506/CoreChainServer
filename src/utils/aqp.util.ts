import {
  Like,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  In,
  IsNull,
  Not,
} from 'typeorm';

export function aqpTypeormConverter(filter: Record<string, any>) {
  if (!filter || Object.keys(filter).length === 0) return {};

  const typeOrmWhere: Record<string, any> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (value === null) {
      typeOrmWhere[key] = IsNull();
      continue;
    }

    if (value instanceof RegExp) {
      // Basic string search implementation for Regex parsed by AQP
      typeOrmWhere[key] = Like(`%${value.source}%`);
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const condition: any = {};
      for (const [operator, opValue] of Object.entries(value)) {
        switch (operator) {
          case '$gt':
            condition[key] = MoreThan(opValue);
            break;
          case '$gte':
            condition[key] = MoreThanOrEqual(opValue);
            break;
          case '$lt':
            condition[key] = LessThan(opValue);
            break;
          case '$lte':
            condition[key] = LessThanOrEqual(opValue);
            break;
          case '$ne':
            condition[key] = Not(opValue);
            break;
          case '$in':
            condition[key] = In(opValue as any[]);
            break;
          case '$regex':
            condition[key] = Like(`%${opValue}%`);
            break;
          default:
            // For non-standard operators, just pass them as equals
            condition[key] = opValue;
            break;
        }
        // Assuming there is mostly one operator per field for simplicity in this utility
        Object.assign(typeOrmWhere, condition);
      }
    } else {
      // Direct equals
      typeOrmWhere[key] = value;
    }
  }

  return typeOrmWhere;
}
