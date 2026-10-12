export { createPage, getPagePagination } from './domain/pagination';
export type { PageData } from './domain/pagination';
export type { Result } from './domain/result';
export { err, ok } from './domain/result';

export { Avatar, AvatarFallback } from './ui/components/avatar';
export { Badge } from './ui/components/badge';
export { Button, buttonVariants } from './ui/components/button';
export {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from './ui/components/card';
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from './ui/components/dialog';
export {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/components/dropdown-menu';
export {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from './ui/components/empty';
export {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldTitle
} from './ui/components/field';
export { Input } from './ui/components/input';
export {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption
} from './ui/components/native-select';
export { Separator } from './ui/components/separator';
export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger
} from './ui/components/sidebar';
export { Skeleton } from './ui/components/skeleton';
export { Toaster } from './ui/components/sonner';
export { Spinner } from './ui/components/spinner';
export { Tabs, TabsList, TabsTrigger } from './ui/components/tabs';
export { ToggleGroup, ToggleGroupItem } from './ui/components/toggle-group';
export { Textarea } from './ui/components/textarea';
export { formatDateForDisplay, toDateString } from './ui/lib/date';
export { toFormData } from './ui/lib/form-data';
export { getInitials } from './ui/lib/initials';
export { formatCount } from './ui/lib/plural';
export { normalizeSearchText } from './ui/lib/search';
export { cn } from './ui/lib/utils';
export { getYouTubeVideoId } from './ui/lib/video';
export { ConfirmDialog } from './ui/patterns/confirm-dialog';
export {
    PageContainer,
    PageHeader,
    PageSection,
    PageSkeleton,
    TileGridSkeleton
} from './ui/patterns/page';
export type { PageBreadcrumb } from './ui/patterns/page';
export { ReturnPointToast } from './ui/patterns/return-point-toast';
export { SearchField } from './ui/patterns/search-field';
export { AddTile, addTileVariants, Tile, TileGrid, TileLink } from './ui/patterns/tile';
export { WizardNavigation, WizardStep, WizardSteps } from './ui/patterns/wizard';
export type { WizardStepDefinition } from './ui/hooks/use-wizard';
export { YouTubeEmbed } from './ui/patterns/youtube-embed';
