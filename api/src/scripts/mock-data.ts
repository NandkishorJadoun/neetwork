import { faker } from '@faker-js/faker';

export const createMockUser = () => {
    return {
        id: faker.string.uuid(),
        githubId: faker.string.numeric(8),
        username: faker.internet.username().toLowerCase(),
        fullname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        about: faker.lorem.sentence(),
    };
};

export const createMockPost = (authorId: string) => {
    return {
        id: faker.string.uuid(),
        text: faker.lorem.sentence(),
        userId: authorId,
    }
}