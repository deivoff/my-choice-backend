import _ from 'lodash';
import data from './data.json';
import { Sex, UserTest } from '$components/user/user-test.entity';

const parseUser = (jsonUser: typeof data[0]): Omit<UserTest, '_id'> => {
  const [lastName, firstName = '-', middleName] = jsonUser['Ф.И.О.']
    .toString()
    .split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')
    .split(' ', 3);

  const phone = normalizePhone(jsonUser['КОНТАКТНЫЙ ТЕЛЕФОН']) || undefined;
  return {
    id: Math.random().toString(36).substr(2, 9),
    firstName,
    middleName,
    lastName,
    age: jsonUser['ВОЗРАСТ'],
    email: jsonUser['АДРЕС ЭЛЕКТРОННОЙ ПОЧТЫ'].replace(/\s+/g, '').toLowerCase(),
    sex: jsonUser['ПОЛ'] === "Мужской" ? Sex.male : Sex.female,
    createdAt: jsonUser['Отметка времени'],
    address: jsonUser['МЕСТО ЖИТЕЛЬСТВА'],
    education: jsonUser['ОБРАЗОВАНИЕ'],
    phone,
  }
};

function normalizePhone(phone: string | number): number {
  let normalizePhone = String(phone);

  if (normalizePhone.charAt(0) === '+') {
    normalizePhone = normalizePhone.substr(1)
  }

  if (normalizePhone.charAt(0) === '8' || normalizePhone.charAt(0) === '7') {
    normalizePhone = normalizePhone.substr(1)
  }

  normalizePhone = normalizePhone.split(/\s+/).join('');
  normalizePhone = normalizePhone.split('-').join('');
  normalizePhone = normalizePhone.split('(').join('');
  normalizePhone = normalizePhone.split(')').join('');

  return Number(normalizePhone);
}

console.log(data.length);
const newData = _.uniqBy(data.map(parseUser),  'email');
console.log(newData.length);
export default newData;
