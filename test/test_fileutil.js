import test from 'ava'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import CommonUtil from '../src/commonutil'
import FileUtil from '../src/fileutil'

const testdatadir = path.join(__dirname, './data')

test.before(t => {
    console.log('Start FileUtil Test')
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
    console.log('End FileUtil Test')
})


test('isExistFileSync', t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(FileUtil.isExistFileSync(file1), true)
    t.is(FileUtil.isExistFileSync(file0), false)
    t.is(FileUtil.isExistFileSync(dir1), true)
    t.is(FileUtil.isExistFileSync(dir0), false)
})

test('isExistFile', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(await FileUtil.isExistFile(file1), true)
    t.is(await FileUtil.isExistFile(file0), false)
    t.is(await FileUtil.isExistFile(dir1), true)
    t.is(await FileUtil.isExistFile(dir0), false)
})

test('fileStat', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(file1)), 'Object')
    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(file0)), 'null')
    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(dir1)), 'Object')
    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(dir0)), 'null')
})

test('isDirSync', t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(FileUtil.isDirSync(file1), false)
    t.is(FileUtil.isDirSync(file0), false)
    t.is(FileUtil.isDirSync(dir1), true)
    t.is(FileUtil.isDirSync(dir0), false)
})

test('isDir', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(await FileUtil.isDir(file1), false)
    t.is(await FileUtil.isDir(file0), false)
    t.is(await FileUtil.isDir(dir1), true)
    t.is(await FileUtil.isDir(dir0), false)
})

test('isFileSync', t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(FileUtil.isFileSync(file1), true)
    t.is(FileUtil.isFileSync(file0), false)
    t.is(FileUtil.isFileSync(dir1), false)
    t.is(FileUtil.isFileSync(dir0), false)
})

test('isFile', async t => {
    const file1 = path.join(__dirname, './data/file1.txt')
    const file0 = path.join(__dirname, './data/file0.txt')
    const dir1 = path.join(__dirname, './data/dir1')
    const dir0 = path.join(__dirname, './data/dir0')

    t.is(await FileUtil.isFile(file1), true)
    t.is(await FileUtil.isFile(file0), false)
    t.is(await FileUtil.isFile(dir1), false)
    t.is(await FileUtil.isFile(dir0), false)
})

test('getFileList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    t.deepEqual(await FileUtil.getFileList(parentDirPath1), ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(await FileUtil.getFileList(parentDirPath2), ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(await FileUtil.getFileList(parentDirPath3), [])
})

test('getFileListSync', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    t.deepEqual(FileUtil.getFileListSync(parentDirPath1), ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(FileUtil.getFileListSync(parentDirPath2), ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(FileUtil.getFileListSync(parentDirPath3), [])
})

test('getDirList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')

    t.deepEqual(await FileUtil.getDirList(parentDirPath1), ['dir1', 'dir2'])
    t.deepEqual(await FileUtil.getDirList(parentDirPath2), [])
})

test('getDirListSync', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')

    t.deepEqual(await FileUtil.getDirListSync(parentDirPath1), ['dir1', 'dir2'])
    t.deepEqual(await FileUtil.getDirListSync(parentDirPath2), [])
})

test('getFilterFileStatList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    const statlist1 = await FileUtil.getFilterFileStatList(parentDirPath1, FileUtil.isDirSync)
    const filenames1 = statlist1.map((st) => { return st.name })
    // console.log(statlist1)

    const statlist2 = await FileUtil.getFilterFileStatList(parentDirPath2, FileUtil.isFileSync)
    const filenames2 = statlist2.map((st) => { return st.name })
    // console.log(statlist2)

    const statlist3 = await FileUtil.getFilterFileStatList(parentDirPath3, FileUtil.isDirSync)
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

    const statlist1 = await FileUtil.getAsyncFilterFileStatList(parentDirPath1, FileUtil.isDir)
    const filenames1 = statlist1.map((st) => { return st.name })
    // console.log(statlist1)

    const statlist2 = await FileUtil.getAsyncFilterFileStatList(parentDirPath2, FileUtil.isFile)
    const filenames2 = statlist2.map((st) => { return st.name })
    // console.log(statlist2)

    const statlist3 = await FileUtil.getAsyncFilterFileStatList(parentDirPath3, FileUtil.isDir)
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

    const statlist1 = await FileUtil.getFileStatList(parentDirPath1)
    const filenames1 = statlist1.map((st) => { return st.name })
    const statlist2 = await FileUtil.getFileStatList(parentDirPath2)
    const filenames2 = statlist2.map((st) => { return st.name })
    const statlist3 = await FileUtil.getFileStatList(parentDirPath3)
    const filenames3 = statlist3.map((st) => { return st.name })

    t.deepEqual(filenames1, ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})

test('getDirStatList', async t => {
    const parentDirPath1 = path.join(__dirname, './data')
    const parentDirPath2 = path.join(__dirname, './data/dir1')
    const parentDirPath3 = path.join(__dirname, './data/dir2')

    const statlist1 = await FileUtil.getDirStatList(parentDirPath1)
    const filenames1 = statlist1.map((st) => { return st.name })
    const statlist2 = await FileUtil.getDirStatList(parentDirPath2)
    const filenames2 = statlist2.map((st) => { return st.name })
    const statlist3 = await FileUtil.getDirStatList(parentDirPath3)
    const filenames3 = statlist3.map((st) => { return st.name })

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, [])
    t.deepEqual(filenames3, [])
})

test('readFile', async t => {
    const file1_2 = `${testdatadir}/dir1/file1_2.txt`;
    const file1_3 = `${testdatadir}/dir1/file1_3.txt`;

    t.is(await FileUtil.readFile(file1_2), 'テスト1_2')
    t.is(await FileUtil.readFile(file1_3, 'utf16le'), 'テスト1_3')
})

