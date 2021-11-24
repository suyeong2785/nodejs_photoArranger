const fs = require('fs');
const fsPromises = require('fs/promises');
const path  = require('path');

//node CLI 명령어입력시 인자받아오기
process.argv[2] ? ArrangeFile(process.argv[2]) : console.log('정리하실 파일의 이름을 입력해주세요');

function ArrangeFile(CLIParam){
  const currentDirArray = __dirname.split(path.sep);
  const targetDir = currentDirArray.slice(0 , 4).join(path.sep) + path.sep + CLIParam + path.sep;

  fs.readdir(`${targetDir}`,async (err, files) => {
    if (err) throw err;
    
    let fileEXT = '';
    let fileName = '';
    let originFile = '';
    
    for(const file of files){

      fileName = file.split(".")[0];
      fileEXT = file.split(".")[1];
      originFile = file.replace("E","");

      if(fileEXT === "mp4" || fileEXT === "mov"){
        //비디오 관련확장자(.mp4/.mov) 저장할 폴더 만들기
        await fsPromises.mkdir(`${targetDir}video`, {recursive: true});
        //비디오 관련확장자(.mp4/.mov) 파일옮기는 비동기함수
        fsPromises.rename(`${targetDir}${file}`, `${targetDir}video${path.sep}${file}`);  

      } else if (fileEXT === "png" || fileEXT === "aae") {
        // 스크린샷사진(.aae/.png) 이동할 파일 
        await fsPromises.mkdir(`${targetDir}duplicated`, {recursive: true});
        // 스크린샷 사진옮기기 
        fsPromises.rename(`${targetDir}${file}`, `${targetDir}captured${path.sep}${file}`);  

      } else if (fileName.includes("_E") === true && fileEXT === "jpg" && files.includes(originFile)) {
        // 보정된 사진이 있을경우 원본사진이 이동할 파일 ex)img_E0710 / img_0710.jpg -> duplicated 
        await fsPromises.mkdir(`${targetDir}captured`, {recursive: true});
        // 원본사진(.jpg) 파일옮기는 비동기함수
        fsPromises.rename(`${targetDir}${originFile}`, `${targetDir}duplicated${path.sep}${originFile}`);  
      }
    }
  });
}