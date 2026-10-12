import { describe,it,expect } from 'vitest';
import { createOptions } from '@/lib/account-rules';
describe('Account publishing rules',()=>{
 it('personal accounts can create post, reel, story and tweet',()=>expect(createOptions('personal')).toEqual(['Post','Reel','Story','Tweet']));
 it('business accounts can also create news, events and tickets',()=>expect(createOptions('business')).toEqual(['Post','Reel','Story','Tweet','News','Event','Ticket']));
});
