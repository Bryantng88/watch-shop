import assert from 'node:assert/strict';import {test} from 'node:test';
import {mapWatchDetailToFormValues} from '../client/form/watch-form.mapper';
import {effectiveMediaParts,mergeWatchSaveReceipt} from './media-work-state';
const base=()=>mapWatchDetailToFormValues({watchId:'w',productId:'p',title:'Bulova',sku:'BLV',watch:{specStatus:'READY'},review:{content:{status:'APPROVED'},image:{status:'APPROVED'}},images:[{role:'COVER',fileKey:'cover.jpg'}]});
const complete={profile:true,content:true,image:true,cover:true};
test('only persisted explicit completion counts; editing each part removes its completed indicator',()=>{
 const saved=base();assert.deepEqual(effectiveMediaParts(complete,saved,saved),complete);
 assert.deepEqual(effectiveMediaParts({profile:false,content:false,image:false,cover:false},saved,saved),{profile:false,content:false,image:false,cover:false});
 for(const part of ['profile','content','image','cover'] as const){const next=structuredClone(saved);if(part==='profile')next.basic.title='Changed';if(part==='content')next.content.body='WIP';if(part==='image')next.media.poolImages=[{key:'new.jpg',url:'/new.jpg'}];if(part==='cover')next.media.coverImage=null;assert.deepEqual(effectiveMediaParts(complete,next,saved),{...complete,[part]:false});}
});
test('late save receipts preserve newer edits and never call unsaved work saved',()=>{
 const sent=base();sent.content.body='Sent draft';const current=structuredClone(sent);current.content.body='Still typing';current.pricing.salePrice='123';current.media.galleryImages=[{key:'new.jpg',url:'/new.jpg'}];
 const receipt=mergeWatchSaveReceipt(current,sent,{hookText:'server hook',media:{poolImages:[],galleryImages:[]}});
 assert.equal(receipt.saved.content.body,'Sent draft');assert.equal(receipt.current.content.body,'Still typing');assert.equal(receipt.current.pricing.salePrice,'123');assert.equal(receipt.current.media.galleryImages[0].key,'new.jpg');
 assert.equal(effectiveMediaParts(complete,receipt.current,receipt.saved).content,false);
 assert.equal(effectiveMediaParts(complete,receipt.current,receipt.saved).image,false);
});
