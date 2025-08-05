import * as ClassTransformer from 'class-transformer';
import { Mapper } from './mapper';

class MockData {
  @ClassTransformer.Expose()
  name: string;
}

describe('common mapper', () => {
  const defaultOptions = {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
  };

  describe('mapData', () => {
    it('should return mapped data from plainToClass', () => {
      const expectedResult = { name: 'John' };
      jest
        .spyOn(ClassTransformer, 'plainToClass')
        .mockReturnValue(expectedResult);

      const result = Mapper.mapData(MockData, { name: 'John' });

      expect(result).toBe(expectedResult);
    });

    it('should call plainToClass with correct arguments', () => {
      const plainToClassSpy = jest
        .spyOn(ClassTransformer, 'plainToClass')
        .mockImplementation();

      Mapper.mapData(MockData, { name: 'John' });

      expect(plainToClassSpy).toHaveBeenCalledWith(
        MockData,
        { name: 'John' },
        {
          ...defaultOptions,
        },
      );
    });

    it("should pass options to plainToClass if they're provided", () => {
      const options = { version: 1 };
      const plainToClassSpy = jest
        .spyOn(ClassTransformer, 'plainToClass')
        .mockImplementation();

      Mapper.mapData(MockData, { name: 'John' }, options);

      expect(plainToClassSpy).toHaveBeenCalledWith(
        MockData,
        { name: 'John' },
        {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
          ...options,
        },
      );
    });
  });

  describe('mapArrayData', () => {
    it('should return data from mapper', () => {
      const expectedResult = { name: 'John' };
      jest
        .spyOn(ClassTransformer, 'plainToClass')
        .mockReturnValue(expectedResult);

      const result = Mapper.mapArrayData(MockData, [{ name: 'John' }]);

      expect(result).toStrictEqual([expectedResult]);
    });

    it('should call plainToClass with correct arguments for each item in the array', () => {
      const options = { version: 1 };
      const plainToClassSpy = jest
        .spyOn(ClassTransformer, 'plainToClass')
        .mockImplementation();

      Mapper.mapArrayData(MockData, [{ name: 'John' }], options);

      expect(plainToClassSpy).toHaveBeenNthCalledWith(
        1,
        MockData,
        { name: 'John' },
        {
          ...defaultOptions,
          ...options,
        },
      );
    });
  });

  describe('mapToPlain', () => {
    it('should return mapped data from instanceToPlain', () => {
      const expectedResult = { name: 'John' } as Record<string, any>;
      jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValue(expectedResult as Record<string, any>[]);

      const result = Mapper.mapToPlain({ name: 'John' });

      expect(result).toBe(expectedResult);
    });

    it("should pass options to instanceToPlain if they're provided", () => {
      const options = { version: 1 };
      const instanceToPlainSpy = jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockImplementation();

      Mapper.mapToPlain({ name: 'John' }, options);

      expect(instanceToPlainSpy).toHaveBeenCalledWith(
        { name: 'John' },
        {
          ...defaultOptions,
          ...options,
        },
      );
    });
  });

  describe('mapToArrayPlain', () => {
    it('should return data from mapper', () => {
      const expectedResult = { name: 'John' } as Record<string, any>;
      jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValue(expectedResult as Record<string, any>[]);

      const result = Mapper.mapToArrayPlain([{ name: 'John' }]);

      expect(result).toStrictEqual([expectedResult]);
    });

    it('should call instanceToPlain with correct arguments for each item in the array', () => {
      const options = { version: 1 };
      const instanceToPlainSpy = jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockImplementation();

      Mapper.mapToArrayPlain([{ name: 'John' }], options);

      expect(instanceToPlainSpy).toHaveBeenNthCalledWith(
        1,
        { name: 'John' },
        {
          ...defaultOptions,
          ...options,
        },
      );
    });
  });
});
