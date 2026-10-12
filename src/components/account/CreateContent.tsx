import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Camera, Clapperboard, CircleDashed, Grid3x3, MessageSquare, Newspaper, Ticket } from 'lucide-react';
import { ResponsiveOverlay } from '@/components/explore/shared';
import { Button } from '@/components/ui/button';
import { Composer } from './ContentComposer';
import { useAccount } from '@/lib/account';
import { createOptions, type CreateKind } from '@/lib/account-rules';
import { supabase } from '@/integrations/supabase/client';
const icons={Post:Grid3x3,Reel:Clapperboard,Story:CircleDashed,Tweet:MessageSquare,News:Newspaper,Event:CalendarDays,Ticket};
export function CreateContent({open,onClose,options,onStory}:{open:boolean;onClose:()=>void;options?:CreateKind[];onStory?:()=>void}) {
  const {user,accountType}=useAccount();const queries=useQueryClient();
  const [kind,setKind]=useState<CreateKind|null>(null);const [switching,setSwitching]=useState(false);
  const close=()=>{setKind(null);onClose();};
  const switchType=async()=>{setSwitching(true);const next=accountType==='business'?'personal':'business';const {error}=await supabase.rpc('set_account_type',{account_type:next});if(!error)await queries.invalidateQueries({queryKey:['account-type']});setSwitching(false);};
  const available=createOptions(accountType).filter(k=>!options||options.includes(k));
  const title=kind?`New ${kind.toLowerCase()}`:onStory?'Add':'Create';
  return <ResponsiveOverlay open={open} onOpenChange={o=>{if(!o)close();}} title={title}>
    <div className="max-h-[75dvh] overflow-y-auto p-5">
      <h2 className="mb-4 text-center font-semibold">{title}</h2>
      {!user?<Button asChild className="w-full"><Link to="/login">Log in to create</Link></Button>:kind?<Composer kind={kind} onClose={close}/>:<>{onStory&&<Button variant="ghost" className="h-12 w-full justify-start" onClick={()=>{close();onStory();}}><Camera/>Story</Button>}{(options?options.filter(k=>available.includes(k)):available).map(k=>{const Icon=icons[k];return <Button key={k} variant="ghost" className="h-12 w-full justify-start" onClick={()=>setKind(k)}><Icon/>{k}</Button>;})}{!options&&<div className="mt-4 border-t border-ink-border pt-4 text-center text-sm"><p className="text-ink-muted capitalize">{accountType} account</p><Button variant="link" disabled={switching} onClick={switchType}>{switching?'Switching…':accountType==='business'?'Switch to personal account':'Switch to business account (events & tickets)'}</Button></div>}</>}
    </div>
  </ResponsiveOverlay>;
}
