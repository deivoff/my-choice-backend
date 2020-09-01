import _ from 'lodash';
import data from './data.json';
import { UserFalse } from '$components/user/user-false.entity';

const parseUser = (jsonUser: typeof data[0]): Omit<UserFalse, '_id'> => {
  const [lastName, firstName = '-', middleName] = jsonUser['Нисова Софья Юрьевна']
    .toString()
    .trim()
    .split(/\s+/).map(word => {
      try {
        return word[0].toUpperCase() + word.substring(1);
      } catch (e) {
        console.error(e, word, jsonUser['Нисова Софья Юрьевна']);
        throw e;
      }
    }).join(' ')
    .split(' ', 3);

  return {
    firstName,
    middleName,
    lastName,
    result: getResult(),
  }
};

function getResult() {
  const number = Math.round(Math.random() * 39);

  return number <= 39 ? number : getResult()
}

console.log(data.length);
const newData = data.map(parseUser);
console.log(newData.length);
export default newData;
