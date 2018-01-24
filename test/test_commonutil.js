import test from 'ava'
import CommonUtil from '../src/commonutil'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'

const testdatadir = path.join(__dirname, './data')

test.before(t => {
    console.log('Start CommonUtil Test')
    console.log('.. Create test data ..')
    fs.closeSync(fs.openSync(`${testdatadir}/file1.txt`, 'w'))
    fs.closeSync(fs.openSync(`${testdatadir}/file2.txt`, 'w'))
    fs.closeSync(fs.openSync(`${testdatadir}/file3.txt`, 'w'))

    fse.mkdirpSync(`${testdatadir}/dir1`)
    fs.closeSync(fs.openSync(`${testdatadir}/dir1/file1_1.txt`, 'w'))
    // fs.closeSync(fs.openSync(`${testdatadir}/dir1/file1_2.txt`, 'w'))
    // fs.closeSync(fs.openSync(`${testdatadir}/dir1/file1_3.txt`, 'w'))
    fs.writeFileSync(`${testdatadir}/dir1/file1_2.txt`, 'テスト1_2')
    fs.writeFileSync(`${testdatadir}/dir1/file1_3.txt`, 'テスト1_3', { encoding: 'utf16le' })

    fse.mkdirpSync(`${testdatadir}/dir2`)
})

test.after(t => {
    console.log('.. Delete test data ..')
    fse.emptyDirSync(testdatadir);
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

test('isExistFileSync', t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(CommonUtil.isExistFileSync(file1), true)
    t.is(CommonUtil.isExistFileSync(file0), false)
    t.is(CommonUtil.isExistFileSync(dir1), true)
    t.is(CommonUtil.isExistFileSync(dir0), false)
})

test('isExistFile', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(await CommonUtil.isExistFile(file1), true)
    t.is(await CommonUtil.isExistFile(file0), false)
    t.is(await CommonUtil.isExistFile(dir1), true)
    t.is(await CommonUtil.isExistFile(dir0), false)
})

test('fileStat', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(CommonUtil.getObjectType(await CommonUtil.fileStat(file1)), 'Object')
    t.is(CommonUtil.getObjectType(await CommonUtil.fileStat(file0)), 'null')
    t.is(CommonUtil.getObjectType(await CommonUtil.fileStat(dir1)), 'Object')
    t.is(CommonUtil.getObjectType(await CommonUtil.fileStat(dir0)), 'null')
})

test('isDirSync', t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(CommonUtil.isDirSync(file1), false)
    t.is(CommonUtil.isDirSync(file0), false)
    t.is(CommonUtil.isDirSync(dir1), true)
    t.is(CommonUtil.isDirSync(dir0), false)
})

test('isDir', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(await CommonUtil.isDir(file1), false)
    t.is(await CommonUtil.isDir(file0), false)
    t.is(await CommonUtil.isDir(dir1), true)
    t.is(await CommonUtil.isDir(dir0), false)
})

test('isFileSync', t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(CommonUtil.isFileSync(file1), true)
    t.is(CommonUtil.isFileSync(file0), false)
    t.is(CommonUtil.isFileSync(dir1), false)
    t.is(CommonUtil.isFileSync(dir0), false)
})

test('isFile', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(await CommonUtil.isFile(file1), true)
    t.is(await CommonUtil.isFile(file0), false)
    t.is(await CommonUtil.isFile(dir1), false)
    t.is(await CommonUtil.isFile(dir0), false)
})

test('getFileList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    t.deepEqual(await CommonUtil.getFileList(parentDirPath1), ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(await CommonUtil.getFileList(parentDirPath2), ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(await CommonUtil.getFileList(parentDirPath3), [])
})

test('getDirList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')

    t.deepEqual(await CommonUtil.getDirList(parentDirPath1), ['dir1', 'dir2'])
    t.deepEqual(await CommonUtil.getDirList(parentDirPath2), [])
})

test('getFilterFileStatList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    const statlist1 = await CommonUtil.getFilterFileStatList(parentDirPath1, CommonUtil.isDirSync)
    const filenames1 = statlist1.map((st) => { return st.name })
    // console.log(statlist1)

    const statlist2 = await CommonUtil.getFilterFileStatList(parentDirPath2, CommonUtil.isFileSync)
    const filenames2 = statlist2.map((st) => { return st.name })
    // console.log(statlist2)

    const statlist3 = await CommonUtil.getFilterFileStatList(parentDirPath3, CommonUtil.isDirSync)
    const filenames3 = statlist3.map((st) => { return st.name })
    // console.log(statlist3)

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})


test('getAsyncFilterFileStatList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    const statlist1 = await CommonUtil.getAsyncFilterFileStatList(parentDirPath1, CommonUtil.isDir)
    const filenames1 = statlist1.map((st) => { return st.name })
    // console.log(statlist1)

    const statlist2 = await CommonUtil.getAsyncFilterFileStatList(parentDirPath2, CommonUtil.isFile)
    const filenames2 = statlist2.map((st) => { return st.name })
    // console.log(statlist2)

    const statlist3 = await CommonUtil.getAsyncFilterFileStatList(parentDirPath3, CommonUtil.isDir)
    const filenames3 = statlist3.map((st) => { return st.name })
    // console.log(statlist3)

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})

test('getFileStatList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    const statlist1 = await CommonUtil.getFileStatList(parentDirPath1)
    const filenames1 = statlist1.map((st) => { return st.name })
    const statlist2 = await CommonUtil.getFileStatList(parentDirPath2)
    const filenames2 = statlist2.map((st) => { return st.name })
    const statlist3 = await CommonUtil.getFileStatList(parentDirPath3)
    const filenames3 = statlist3.map((st) => { return st.name })

    t.deepEqual(filenames1, ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})

test('getDirStatList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    const statlist1 = await CommonUtil.getDirStatList(parentDirPath1)
    const filenames1 = statlist1.map((st) => { return st.name })
    const statlist2 = await CommonUtil.getDirStatList(parentDirPath2)
    const filenames2 = statlist2.map((st) => { return st.name })
    const statlist3 = await CommonUtil.getDirStatList(parentDirPath3)
    const filenames3 = statlist3.map((st) => { return st.name })

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, [])
    t.deepEqual(filenames3, [])
})

test('getDirStatList', async t => {
    const file1_2 = `${testdatadir}/dir1/file1_2.txt`;
    const file1_3 = `${testdatadir}/dir1/file1_3.txt`;

    t.is(await CommonUtil.readFile(file1_2), 'テスト1_2')
    t.is(await CommonUtil.readFile(file1_3, 'utf16le'), 'テスト1_3')
})

