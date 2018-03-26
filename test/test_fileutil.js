import test from 'ava'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import CommonUtil from '../src/commonutil'
import FileUtil from '../src/fileutil'

const testbasedir = path.join(__dirname, './data')
const testfile = {
    file1: `${testbasedir}/file1.txt`,
    file2: `${testbasedir}/file2.txt`,
    file3: `${testbasedir}/file3.txt`,
    dir1: `${testbasedir}/dir1`,
    dir2: `${testbasedir}/dir2`,
    file1_1: `${testbasedir}/dir1/file1_1.txt`,
    file1_2: `${testbasedir}/dir1/file1_2.txt`,
    file1_3: `${testbasedir}/dir1/file1_3.txt`
}

const testbasedir2 = path.join(__dirname, './data2')
const testfile2 = {
    file1: `${testbasedir2}/file1.txt`,
    file2: `${testbasedir2}/file2.txt`,
    file3: `${testbasedir2}/file3.txt`,
    file4: `${testbasedir2}/file4.txt`,
}

test.before(t => {
    console.log('Start FileUtil Test')
    console.log('.. Create test data ..')
    fse.emptyDirSync(testbasedir);
    fs.closeSync(fs.openSync(testfile.file1, 'w'))
    fs.closeSync(fs.openSync(testfile.file2, 'w'))
    fs.closeSync(fs.openSync(testfile.file3, 'w'))

    fse.mkdirpSync(testfile.dir1)
    fse.mkdirpSync(testfile.dir2)
    fs.closeSync(fs.openSync(testfile.file1_1, 'w'))
    fs.writeFileSync(testfile.file1_2, 'テスト1_2')
    fs.writeFileSync(testfile.file1_3, 'テスト1_3', { encoding: 'utf16le' })

    fse.emptyDirSync(testbasedir2)
})

test.after(t => {
    console.log('.. Delete test data ..')
    fse.emptyDirSync(testbasedir);
    fse.emptyDirSync(testbasedir2)
    console.log('End FileUtil Test')
})


test('isExistFileSync', t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(FileUtil.isExistFileSync(testfile.file1), true)
    t.is(FileUtil.isExistFileSync(file0), false)
    t.is(FileUtil.isExistFileSync(testfile.dir1), true)
    t.is(FileUtil.isExistFileSync(dir0), false)
})

test('isExistFile', async t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(await FileUtil.isExistFile(testfile.file1), true)
    t.is(await FileUtil.isExistFile(file0), false)
    t.is(await FileUtil.isExistFile(testfile.dir1), true)
    t.is(await FileUtil.isExistFile(dir0), false)
})

test('fileStat', async t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(testfile.file1)), 'Object')
    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(file0)), 'null')
    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(testfile.dir1)), 'Object')
    t.is(CommonUtil.getObjectType(await FileUtil.fileStat(dir0)), 'null')
})

test('isDirSync', t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(FileUtil.isDirSync(testfile.file1), false)
    t.is(FileUtil.isDirSync(file0), false)
    t.is(FileUtil.isDirSync(testfile.dir1), true)
    t.is(FileUtil.isDirSync(dir0), false)
})

test('isDir', async t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(await FileUtil.isDir(testfile.file1), false)
    t.is(await FileUtil.isDir(file0), false)
    t.is(await FileUtil.isDir(testfile.dir1), true)
    t.is(await FileUtil.isDir(dir0), false)
})

test('isFileSync', t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(FileUtil.isFileSync(testfile.file1), true)
    t.is(FileUtil.isFileSync(file0), false)
    t.is(FileUtil.isFileSync(testfile.dir1), false)
    t.is(FileUtil.isFileSync(dir0), false)
})

test('isFile', async t => {
    const file0 = `${testbasedir}/file0.txt`
    const dir0 = `${testbasedir}/dir0`

    t.is(await FileUtil.isFile(testfile.file1), true)
    t.is(await FileUtil.isFile(file0), false)
    t.is(await FileUtil.isFile(testfile.dir1), false)
    t.is(await FileUtil.isFile(dir0), false)
})

test('getFileList', async t => {
    t.deepEqual(await FileUtil.getFileList(testbasedir), ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(await FileUtil.getFileList(testfile.dir1), ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(await FileUtil.getFileList(testfile.dir2), [])
})

test('getFileListSync', async t => {
    t.deepEqual(FileUtil.getFileListSync(testbasedir), ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(FileUtil.getFileListSync(testfile.dir1), ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(FileUtil.getFileListSync(testfile.dir2), [])
})

test('getDirList', async t => {
    t.deepEqual(await FileUtil.getDirList(testbasedir), ['dir1', 'dir2'])
    t.deepEqual(await FileUtil.getDirList(testfile.dir1), [])
})

test('getDirListSync', async t => {
    t.deepEqual(await FileUtil.getDirListSync(testbasedir), ['dir1', 'dir2'])
    t.deepEqual(await FileUtil.getDirListSync(testfile.dir1), [])
})

test('getFilterFileStatList', async t => {
    const statlist1 = await FileUtil.getFilterFileStatList(testbasedir, FileUtil.isDirSync)
    const filenames1 = statlist1.map((st) => { return st.name })
    // console.log(statlist1)

    const statlist2 = await FileUtil.getFilterFileStatList(testfile.dir1, FileUtil.isFileSync)
    const filenames2 = statlist2.map((st) => { return st.name })
    // console.log(statlist2)

    const statlist3 = await FileUtil.getFilterFileStatList(testfile.dir2, FileUtil.isDirSync)
    const filenames3 = statlist3.map((st) => { return st.name })
    // console.log(statlist3)

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})


test('getAsyncFilterFileStatList', async t => {
    const statlist1 = await FileUtil.getAsyncFilterFileStatList(testbasedir, FileUtil.isDir)
    const filenames1 = statlist1.map((st) => { return st.name })
    // console.log(statlist1)

    const statlist2 = await FileUtil.getAsyncFilterFileStatList(testfile.dir1, FileUtil.isFile)
    const filenames2 = statlist2.map((st) => { return st.name })
    // console.log(statlist2)

    const statlist3 = await FileUtil.getAsyncFilterFileStatList(testfile.dir2, FileUtil.isDir)
    const filenames3 = statlist3.map((st) => { return st.name })
    // console.log(statlist3)

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})

test('getFileStatList', async t => {
    const statlist1 = await FileUtil.getFileStatList(testbasedir)
    const filenames1 = statlist1.map((st) => { return st.name })
    const statlist2 = await FileUtil.getFileStatList(testfile.dir1)
    const filenames2 = statlist2.map((st) => { return st.name })
    const statlist3 = await FileUtil.getFileStatList(testfile.dir2)
    const filenames3 = statlist3.map((st) => { return st.name })

    t.deepEqual(filenames1, ['file1.txt', 'file2.txt', 'file3.txt'])
    t.deepEqual(filenames2, ['file1_1.txt', 'file1_2.txt', 'file1_3.txt'])
    t.deepEqual(filenames3, [])
})

test('getDirStatList', async t => {
    const statlist1 = await FileUtil.getDirStatList(testbasedir)
    const filenames1 = statlist1.map((st) => { return st.name })
    const statlist2 = await FileUtil.getDirStatList(testfile.dir1)
    const filenames2 = statlist2.map((st) => { return st.name })
    const statlist3 = await FileUtil.getDirStatList(testfile.dir1)
    const filenames3 = statlist3.map((st) => { return st.name })

    t.deepEqual(filenames1, ['dir1', 'dir2'])
    t.deepEqual(filenames2, [])
    t.deepEqual(filenames3, [])
})

test('readFile', async t => {
    t.is(await FileUtil.readFile(testfile.file1_2), 'テスト1_2')
    t.is(await FileUtil.readFile(testfile.file1_3, 'utf16le'), 'テスト1_3')
})

test('writeFile', async t => {
    await FileUtil.writeFile(testfile2.file1, 'write string')
    await FileUtil.writeFile(testfile2.file2, { write1: 'Object', write2: 2 })
    await FileUtil.writeFile(testfile2.file3, null)
    await FileUtil.writeFile(testfile2.file4, 'write string', 'utf16le')

    t.is(await FileUtil.readFile(testfile2.file1), 'write string')
    t.is(await FileUtil.readFile(testfile2.file2), '{"write1":"Object","write2":2}')
    t.is(await FileUtil.readFile(testfile2.file3), 'null')
    t.is(await FileUtil.readFile(testfile2.file4, 'utf16le'), 'write string')
})
