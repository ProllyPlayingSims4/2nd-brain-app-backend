export const Random = (length: number) => {
     const options = "abcdefghijklmnopqrstuvwxyz1234567890";
     let ans = "";
     for(let i = 0; i < length; i++){
        ans += options[Math.floor(Math.random() * options.length)];
     }
     return ans;
}