import { URL } from 'url'
import { UserInputError } from 'apollo-server-micro'
import firebase from '~/graphql/api/firebase'
import getBookmarkMetaData from './getBookmarkMetaData'

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

export async function editBookmark(_, { id, title }) {
  if (!title || title.length === 0)
    throw new UserInputError('Bookmark must have a title')

  await firebase.collection('bookmarks').doc(id).update({ title })

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .get()
    .then((doc) => doc.data())
}

export async function addBookmark(_, { url }) {
  if (!isValidUrl(url)) throw new UserInputError('URL was invalid')

  const existingRef = await firebase
    .collection('bookmarks')
    .where('url', '==', url)
    .get()
    .then((snapshot) => !snapshot.empty)

  if (existingRef) throw new UserInputError('URL already exists')

  const metadata = await getBookmarkMetaData(url)

  const id = await firebase
    .collection('bookmarks')
    .add({
      createdAt: new Date(),
      ...metadata,
    })
    .then(({ id }) => id)

  return await firebase
    .collection('bookmarks')
    .doc(id)
    .get()
    .then((doc) => doc.data())
    .then((res) => ({ ...res, id }))
}

export async function deleteBookmark(_, { id }) {
  return await firebase
    .collection('bookmarks')
    .doc(id)
    .delete()
    .then(() => true)
}