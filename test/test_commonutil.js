import test from 'ava'
import CommonUtil from '../src/commonutil'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'

const testdatadir = path.join(__dirname, './data')

test.before(t => {
    console.log('Start CommonUtil Test')
})

test.after(t => {
    console.log('End CommonUtil Test')
})

test('getObjectType', t => {
    const und = undefined
    const nll = null
    const str = 'abcd'

    const int = 1
    const flt = 1.1234
    const inf = Infinity
    const nan = NaN

    const array = [1, 2, 3]
    const obj = { str: 'abcd', array: [1, 2] }
    const fnc = function () { return 1 }

    t.is(CommonUtil.getObjectType(und), 'undefined')
    t.is(CommonUtil.getObjectType(nll), 'null')
    t.is(CommonUtil.getObjectType(str), 'String')

    t.is(CommonUtil.getObjectType(int), 'Number')
    t.is(CommonUtil.getObjectType(flt), 'Number')
    t.is(CommonUtil.getObjectType(inf), 'Number')
    t.is(CommonUtil.getObjectType(nan), 'Number')

    t.is(CommonUtil.getObjectType(array), 'Array')
    t.is(CommonUtil.getObjectType(obj), 'Object')
    t.is(CommonUtil.getObjectType(fnc), 'Function')
})

test('getNumberType', t => {
    const und = undefined
    const nll = null
    const str = 'abcd'

    const int = 1
    const flt = 1.1234
    const inf = Infinity
    const nan = NaN

    const array = [1, 2, 3]
    const obj = { str: 'abcd', array: [1, 2] }
    const fnc = function () { return 1 }

    t.is(CommonUtil.getNumberType(und), null)
    t.is(CommonUtil.getNumberType(nll), null)
    t.is(CommonUtil.getNumberType(str), null)

    t.is(CommonUtil.getNumberType(int), 'Integer')
    t.is(CommonUtil.getNumberType(flt), 'Float')
    t.is(CommonUtil.getNumberType(inf), 'InfiniteNumber')
    t.is(CommonUtil.getNumberType(nan), 'InfiniteNumber')

    t.is(CommonUtil.getNumberType(array), null)
    t.is(CommonUtil.getNumberType(obj), null)
    t.is(CommonUtil.getNumberType(fnc), null)
})

test('is', t => {
    const und = undefined
    const nll = null
    const str = 'abcd'

    const int = 1
    const flt = 1.1234
    const inf = Infinity
    const nan = NaN

    const array = [1, 2, 3]
    const obj = { str: 'abcd', array: [1, 2] }
    const fnc = function () { return 1 }

    t.is(CommonUtil.is('undefined', und), true)
    t.is(CommonUtil.is('null', nll), true)
    t.is(CommonUtil.is('String', str), true)

    t.is(CommonUtil.is('Number', int), true)
    t.is(CommonUtil.is('Number', flt), true)
    t.is(CommonUtil.is('Number', inf), true)
    t.is(CommonUtil.is('Number', nan), true)

    t.is(CommonUtil.is('Array', array), true)
    t.is(CommonUtil.is('Object', obj), true)
    t.is(CommonUtil.is('Function', fnc), true)
})


