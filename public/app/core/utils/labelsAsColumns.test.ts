import {
  ArrayVector,
  DataTransformerConfig,
  DataTransformerID,
  Field,
  FieldType,
  toDataFrame,
  transformDataFrame,
} from '@grafana/data';
import { mockTransformationsRegistry } from '@grafana/data/src/utils/tests/mockTransformationsRegistry';
import {
  LabelsAsColumnsOptions,
  labelsAsColumnsTransformer,
} from '@grafana/data/src/transformations/transformers/labelsAsColumns';

describe('Labels as Columns', () => {
  beforeAll(() => {
    mockTransformationsRegistry([labelsAsColumnsTransformer]);
  });

  it('data frame with 1 value and 1 label', () => {
    const cfg: DataTransformerConfig<LabelsAsColumnsOptions> = {
      id: DataTransformerID.labelsAsColumns,
      options: {},
    };

    const oneValueOneLabelA = toDataFrame({
      name: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1000] },
        { name: 'temp', type: FieldType.number, values: [1], labels: { location: 'inside' } },
      ],
    });

    const oneValueOneLabelB = toDataFrame({
      name: 'B',
      fields: [
        { name: 'time', type: FieldType.time, values: [2000] },
        { name: 'temp', type: FieldType.number, values: [-1], labels: { location: 'outside' } },
      ],
    });

    const result = transformDataFrame([cfg], [oneValueOneLabelA, oneValueOneLabelB]);
    const expected: Field[] = [
      { name: 'time', type: FieldType.time, values: new ArrayVector([1000, 2000]), config: {} },
      { name: 'location', type: FieldType.string, values: new ArrayVector(['inside', 'outside']), config: {} },
      { name: 'temp', type: FieldType.number, values: new ArrayVector([1, -1]), config: {} },
    ];

    expect(result[0].fields).toEqual(expected);
  });

  it('data frame with 2 values and 1 label', () => {
    const cfg: DataTransformerConfig<LabelsAsColumnsOptions> = {
      id: DataTransformerID.labelsAsColumns,
      options: {},
    };

    const twoValuesOneLabelA = toDataFrame({
      name: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1000] },
        { name: 'temp', type: FieldType.number, values: [1], labels: { location: 'inside' } },
        { name: 'humidity', type: FieldType.number, values: [10000], labels: { location: 'inside' } },
      ],
    });

    const twoValuesOneLabelB = toDataFrame({
      name: 'B',
      fields: [
        { name: 'time', type: FieldType.time, values: [2000] },
        { name: 'temp', type: FieldType.number, values: [-1], labels: { location: 'outside' } },
        { name: 'humidity', type: FieldType.number, values: [11000], labels: { location: 'outside' } },
      ],
    });

    const result = transformDataFrame([cfg], [twoValuesOneLabelA, twoValuesOneLabelB]);
    const expected: Field[] = [
      { name: 'time', type: FieldType.time, values: new ArrayVector([1000, 2000]), config: {} },
      { name: 'location', type: FieldType.string, values: new ArrayVector(['inside', 'outside']), config: {} },
      { name: 'temp', type: FieldType.number, values: new ArrayVector([1, -1]), config: {} },
      { name: 'humidity', type: FieldType.number, values: new ArrayVector([10000, 11000]), config: {} },
    ];

    expect(result[0].fields).toEqual(expected);
  });

  it('data frame with 1 value and 2 labels', () => {
    const cfg: DataTransformerConfig<LabelsAsColumnsOptions> = {
      id: DataTransformerID.labelsAsColumns,
      options: {},
    };

    const oneValueTwoLabelsA = toDataFrame({
      name: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1000] },
        { name: 'temp', type: FieldType.number, values: [1], labels: { location: 'inside', area: 'living room' } },
      ],
    });

    const oneValueTwoLabelsB = toDataFrame({
      name: 'B',
      fields: [
        { name: 'time', type: FieldType.time, values: [2000] },
        { name: 'temp', type: FieldType.number, values: [-1], labels: { location: 'outside', area: 'backyard' } },
      ],
    });

    const result = transformDataFrame([cfg], [oneValueTwoLabelsA, oneValueTwoLabelsB]);
    const expected: Field[] = [
      { name: 'time', type: FieldType.time, values: new ArrayVector([1000, 2000]), config: {} },
      { name: 'location', type: FieldType.string, values: new ArrayVector(['inside', 'outside']), config: {} },
      { name: 'area', type: FieldType.string, values: new ArrayVector(['living room', 'backyard']), config: {} },
      { name: 'temp', type: FieldType.number, values: new ArrayVector([1, -1]), config: {} },
    ];

    expect(result[0].fields).toEqual(expected);
  });

  it('data frame with 2 values and 2 labels', () => {
    const cfg: DataTransformerConfig<LabelsAsColumnsOptions> = {
      id: DataTransformerID.labelsAsColumns,
      options: {},
    };

    const twoValuesTwoLabelsA = toDataFrame({
      name: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1000] },
        { name: 'temp', type: FieldType.number, values: [1], labels: { location: 'inside', area: 'living room' } },
        {
          name: 'humidity',
          type: FieldType.number,
          values: [10000],
          labels: { location: 'inside', area: 'living room' },
        },
      ],
    });

    const twoValuesTwoLabelsB = toDataFrame({
      name: 'B',
      fields: [
        { name: 'time', type: FieldType.time, values: [2000] },
        { name: 'temp', type: FieldType.number, values: [-1], labels: { location: 'outside', area: 'backyard' } },
        {
          name: 'humidity',
          type: FieldType.number,
          values: [11000],
          labels: { location: 'outside', area: 'backyard' },
        },
      ],
    });

    const result = transformDataFrame([cfg], [twoValuesTwoLabelsA, twoValuesTwoLabelsB]);
    const expected: Field[] = [
      { name: 'time', type: FieldType.time, values: new ArrayVector([1000, 2000]), config: {} },
      { name: 'location', type: FieldType.string, values: new ArrayVector(['inside', 'outside']), config: {} },
      { name: 'area', type: FieldType.string, values: new ArrayVector(['living room', 'backyard']), config: {} },
      { name: 'temp', type: FieldType.number, values: new ArrayVector([1, -1]), config: {} },
      { name: 'humidity', type: FieldType.number, values: new ArrayVector([10000, 11000]), config: {} },
    ];

    expect(result[0].fields).toEqual(expected);
  });

  it('data frames with different labels', () => {
    const cfg: DataTransformerConfig<LabelsAsColumnsOptions> = {
      id: DataTransformerID.labelsAsColumns,
      options: {},
    };

    const oneValueDifferentLabelsA = toDataFrame({
      name: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1000] },
        { name: 'temp', type: FieldType.number, values: [1], labels: { location: 'inside', feelsLike: 'ok' } },
      ],
    });

    const oneValueDifferentLabelsB = toDataFrame({
      name: 'B',
      fields: [
        { name: 'time', type: FieldType.time, values: [2000] },
        { name: 'temp', type: FieldType.number, values: [-1], labels: { location: 'outside', sky: 'cloudy' } },
      ],
    });

    const result = transformDataFrame([cfg], [oneValueDifferentLabelsA, oneValueDifferentLabelsB]);
    const expected: Field[] = [
      { name: 'time', type: FieldType.time, values: new ArrayVector([1000, 2000]), config: {} },
      { name: 'location', type: FieldType.string, values: new ArrayVector(['inside', 'outside']), config: {} },
      { name: 'feelsLike', type: FieldType.string, values: new ArrayVector(['ok', null]), config: {} },
      { name: 'sky', type: FieldType.string, values: new ArrayVector([null, 'cloudy']), config: {} },
      { name: 'temp', type: FieldType.number, values: new ArrayVector([1, -1]), config: {} },
    ];

    expect(result[0].fields).toEqual(expected);
  });
});
