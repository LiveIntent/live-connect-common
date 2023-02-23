import { expect, use } from 'chai'
import * as utils from '../src/utils'
import dirtyChai from 'dirty-chai'

use(dirtyChai)

describe('StringUtils', () => {
  it('should return a string if the argument is a number', function () {
    const result = utils.safeToString(22)
    expect(result).to.eql('22')
  })

  it('should return a trimmed string', function () {
    const result = utils.trim(' ssd    ')
    expect(result).to.eql('ssd')
  })

  it('should return a trimmed string even if the value is not a string', function () {
    const result = utils.trim(2)
    expect(result).to.eql('2')
  })

  it('should return a json if the argument is an object', function () {
    const result = utils.safeToString({
      a: '123',
      b: 321
    })

    expect(result).to.eql('{"a":"123","b":321}')
  })

  it('should return correct values when checking string equality while ignoring case', function () {
    expect(utils.strEqualsIgnoreCase(null, undefined)).to.be.false()
    expect(utils.strEqualsIgnoreCase(undefined, '')).to.be.false()
    expect(utils.strEqualsIgnoreCase('null', 'undefined')).to.be.false()
    expect(utils.strEqualsIgnoreCase('x', 'y')).to.be.false()
    expect(utils.strEqualsIgnoreCase('X', 'Y')).to.be.false()
    expect(utils.strEqualsIgnoreCase('X', 'x')).to.be.true()
    expect(utils.strEqualsIgnoreCase('  X  ', '  x  ')).to.be.true()
  })

  it('should return correct isObject checks', function () {
    expect(utils.isObject('.')).to.be.false()
    expect(utils.isObject([])).to.be.false()
    expect(utils.isObject(null)).to.be.false()
    expect(utils.isObject(undefined)).to.be.false()
    expect(utils.isObject(123)).to.be.false()
  })
})
